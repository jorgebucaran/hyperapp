module.exports = require("hyperx")(function (h) {
    return function (tagName, attrs, children) {
        var data = {
            "class": {},
            props: {},
            style: {},
            attrs: {},
            hook: {},
            on: {}
        }

        for (var key in attrs) {
            if (key === undefined || !attrs.hasOwnProperty(key)) {
                continue
            }
            var value = attrs[key]

            if (key === "className") {
                var cls = value.split(" ")
                for (var i = 0; i < cls.length; i++) {
                    data["class"][cls[i]] = true
                }
            } else if (key === "style") {
                data.style = value

            } else if ("on" === key.substr(0, 2)) {
                data.on[key.substr(2)] = value

            } else if ("data-hook-" === key.substr(0, 10)) {
                data.hook[key.substr(10)] = value

            } else {
                if (isSVG(tagName)) {
                    data.attrs[key] = parseBool(value)
                    continue
                }
                data.props[key] = data.attrs[key] = parseBool(value)
            }
        }

        return h(tagName, data, children ? [].concat.apply([], children) : children)
    }
}(require("snabbdom/h").h))

function parseBool(value) {
    return value === "true" ? true : value === "false" ? false : value
}

function isSVG(tagName) {
    var svgTags = [
        "svg", "animate", "animateTransform", "circle", "cursor", "desc", "ellipse",
        "feBlend", "feColorMatrix", "feComposite",
        "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap",
        "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR",
        "feGaussianBlur", "feImage", "feMergeNode", "feMorphology",
        "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile",
        "feTurbulence", "font-face-format", "font-face-name", "font-face-uri",
        "glyph", "glyphRef", "hkern", "image", "line", "missing-glyph", "mpath",
        "path", "polygon", "polyline", "rect", "set", "stop", "tref", "use", "view",
        "vkern"
    ]

    for (var i = 0; i < svgTags.length; i++) {
        if (tagName === svgTags[i]) {
            return true
        }
    }

    return false
}