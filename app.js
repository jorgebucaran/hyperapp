module.exports = function (options) {
    var msg = {}

    var model = options.model
    var reducers = options.update || {}
    var effects = options.effects || {}
    var subs = options.subs || {}

    var hooks = merge({
        onAction: Function.prototype,
        onUpdate: Function.prototype,
        onError: function (err) {
            throw err
        }
    }, options.hooks)

    var node
    var root = options.root || document.body.appendChild(document.createElement("div"))
    var view = options.view || function () {
            return root
        }
    var routes = typeof view === "function" ? undefined : view

    if (routes) {
        view = route(routes, getHashOrPath())

        msg.setLocation = function (data) {
            if (history && history.pushState) {
                render(model, view = route(routes, data), node)
                history.pushState({}, "", data)

            } else {
                window.location.hash = data
            }
        }

        window[history && history.pushState ? "onpopstate" : "onhashchange"] = function () {
            render(model, view = route(routes, getHashOrPath()), node)
        }

        window.onclick = function (e) {
            if (e.metaKey || e.shiftKey || e.ctrlKey || e.altKey) {
                return
            }

            var target = e.target

            while (target && target.localName !== "a") {
                target = target.parentNode
            }

            if (target && target.host === location.host
                && !target.hasAttribute("data-no-routing")) {

                var element = target.hash === "" ? element : document.querySelector(target.hash)
                if (element) {
                    element.scrollIntoView(true)

                } else {
                    msg.setLocation(target.pathname)
                    return false
                }
            }
        }

        function getHashOrPath() {
            return location.hash ? location.hash.substr(1) : location.pathname
        }
    }

    for (var name in merge(reducers, effects)) {
        (function (name) {
            msg[name] = function (data) {
                hooks.onAction(name, data)

                var effect = effects[name]
                if (effect) {
                    return effect(model, msg, data, hooks.onError)
                }

                var update = reducers[name], _model = model
                render(model = merge(model, update(model, data)), view, node)

                hooks.onUpdate(_model, model, data)
            }
        } (name))
    }

    document.addEventListener("DOMContentLoaded", function () {
        for (var sub in subs) {
            subs[sub](model, msg, hooks.onError)
        }
    })

    render(model, view)

    function render(model, view, lastNode) {
        patch(root, node = view(model, msg), lastNode, 0)
    }

    function route(routes, path) {
        for (var route in routes) {
            var re = regexify(route), params = {}, match

            path.replace(new RegExp(re.re, "g"), function () {
                for (var i = 1; i < arguments.length - 2; i++) {
                    params[re.keys.shift()] = arguments[i]
                }

                match = function (model, msg) {
                    return routes[route](model, msg, params)
                }
            })

            if (match) {
                return match
            }
        }

        return routes["/"]
    }

    function regexify(path) {
        var keys = [], re = "^" + path
            .replace(/\//g, "\\/")
            .replace(/:([A-Za-z0-9_]+)/g, function (_, key) {
                keys.push(key)
                return "([A-Za-z0-9_]+)"
            }) + "/?$"

        return { re: re, keys: keys }
    }

    function isPrimitive(type) {
        return type === "string" || type === "number" || type === "boolean"
    }

    function defer(fn, data) {
        setTimeout(function () {
            fn(data)
        }, 0)
    }

    function merge(a, b) {
        var obj = {}, key

        for (key in a) {
            obj[key] = a[key]
        }
        for (key in b) {
            obj[key] = b[key]
        }

        return isPrimitive(typeof b) ? b : obj
    }

    function shouldUpdate(a, b) {
        return a.tag !== b.tag
            || typeof a !== typeof b
            || isPrimitive(typeof a) && a !== b
    }

    function createElementFrom(node, element) {
        if (isPrimitive(typeof node)) {
            element = document.createTextNode(node)

        } else {
            element = node.data && node.data.ns
                ? document.createElementNS(node.data.ns, node.tag)
                : document.createElement(node.tag)

            for (var name in node.data) {
                if (name === "oncreate") {
                    defer(node.data[name], element)
                } else {
                    setElementData(element, name, node.data[name])
                }
            }

            for (var i = 0; i < node.tree.length; i++) {
                element.appendChild(createElementFrom(node.tree[i]))
            }
        }

        return element
    }

    function removeElementData(element, name, value) {
        element.removeAttribute(name === "className" ? "class" : name)
        if (typeof value === "boolean" || value === "true" || value === "false") {
            element[name] = false
        }
    }

    function setElementData(element, name, value, oldValue) {
        if (name === "style") {
            for (var i in value) {
                element.style[i] = value[i]
            }

        } else if (name.substr(0, 2) === "on") {
            var event = name.substr(2)
            element.removeEventListener(event, oldValue)
            element.addEventListener(event, value)

        } else {
            if (value === "false" || value === false) {
                element.removeAttribute(name)
                element[name] = false
            } else {
                element.setAttribute(name, value)
                element[name] = value
            }
        }
    }

    function updateElementData(element, data, oldData) {
        for (var name in merge(oldData, data)) {
            var value = data[name], oldValue = oldData[name]

            if (value === undefined) {
                removeElementData(element, name, oldValue)

            } else if (value !== oldValue) {
                if (name === "onupdate") {
                    defer(value, element)
                } else {
                    setElementData(element, name, value, oldValue)
                }
            }
        }
    }

    function patch(parent, node, oldNode, index) {
        if (oldNode === undefined) {
            parent.appendChild(createElementFrom(node))

        } else if (node === undefined) {
            while (index > 0 && !parent.childNodes[index]) {
                index--
            }

            if (index >= 0) {
                var element = parent.childNodes[index]

                if (oldNode && oldNode.data) {
                    var hook = oldNode.data.onremove
                    if (typeof hook === "function") {
                        defer(hook, element)
                    }
                }

                parent.removeChild(element)
            }

        } else if (shouldUpdate(node, oldNode)) {
            parent.replaceChild(createElementFrom(node), parent.childNodes[index])

        } else if (node.tag) {
            var element = parent.childNodes[index]

            updateElementData(element, node.data, oldNode.data)

            var len = node.tree.length, oldLen = oldNode.tree.length

            for (var i = 0; i < len || i < oldLen; i++) {
                patch(element, node.tree[i], oldNode.tree[i], i)
            }
        }
    }
}
