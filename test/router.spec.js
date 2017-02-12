/* global describe, it, expect */

const { router } = require("../")

describe("Router", () => {
    Object.defineProperty(window.location, "pathname", {
        writable: true
    })

    Object.defineProperty(window.location, "host", {
        writable: true
    })

    function matchRouteWithPath({ view, path, expected }) {
        window.location.pathname = path
        router({
            view, render: (match) => expect(match({}, {}, {})).toBe(expected())
        })
    }

    it("matches complete routes", () => {
        const view = {
            "/home": _ => "Tokyo",
            "/repos/hyperapp": _ => "Godzilla",
            "/h/y/p/e/r/a/p/p": _ => "Supersonic",
        }

        Object.keys(view).forEach(path => {
            matchRouteWithPath({
                view,
                path,
                expected: view[path]
            })
        })
    })

    it("matches routes w/ slugs", () => {
        const view = {
            "/": _ => true,
            "/:key": (model, actions, { key }) => `Key:${key}`,
            "/repos/:id": (model, actions, { id }) => `Repos/Id:${id}`,
            "/:a/:b/:c": (model, actions, { a, b, c }) => `a:${a}/b:${b}/c:${c}`,
        };

        matchRouteWithPath({
            view,
            path: "/dope",
            expected: view["/:key"].bind({}, {}, {}, { key: "dope" })
        })

        matchRouteWithPath({
            view,
            path: "/repos/42",
            expected: view["/repos/:id"].bind({}, {}, {}, { id: "42" })
        })

        matchRouteWithPath({
            view,
            path: "/tic/tac/toe",
            expected: view["/:a/:b/:c"].bind({}, {}, {}, { a: "tic", b: "tac", c: "toe" })
        })

        matchRouteWithPath({
            view,
            path: "/not/going/to/match",
            expected: view["/"]
        })
    })


    it("sets the location using setLocation", () => {
        const actions = {}

        window.history.pushState = (a, b, data) => expect(data).toBe("/foo")
        window.location.pathname = "/"

        router({
            view: {
                "/": (model, actions) => { },
                "/:key": (model, actions, { key }) => expect(key).toBe("foo")
            },
            render: match => match(42, actions)
        })

        actions.setLocation("/foo")
    })

    it("listens to popstate", done => {
        function firePopstate() {
            const event = document.createEvent("Event")
            event.initEvent("popstate", true, true)
            window.document.dispatchEvent(event)
        }

        window.location.pathname = "/"

        router({
            view: {
                "/": Function.prototype,
                "/:key": (model, _, { key }) => {
                    expect(key).toBe("bar")
                    done()
                }
            },
            render: match => match(42, {})
        })

        window.location.pathname = "/bar"
        firePopstate()
    })

    it("intercepts href clicks", done => {
        function fireClick(options) {
            const event = document.createEvent("Event")

            Object.defineProperty(event, "target", {
                writable: true
            })

            Object.assign(event, options)

            event.initEvent("click", true, false)
            window.dispatchEvent(event)
        }

        window.location.pathname = "/"
        window.location.host = "foo"

        router({
            view: {
                "/": Function.prototype,
                "/:key": (model, actions, { key }) => {
                    expect(key).toBe("baz")
                    done()
                }
            },
            render: match => match({}, {})
        })

        fireClick({ metaKey: true })
        fireClick({ altKey: true })
        fireClick({ ctrlKey: true })
        fireClick({ shiftKey: true })

        fireClick({
            target: {
                parentNode: {
                    localName: "a",
                    host: "foo",
                    pathname: "/baz",
                    hasAttribute: Function.prototype
                }
            }
        })
    })
})
