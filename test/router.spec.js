/* global describe, it, expect */

import { router } from "../src"

describe("Router", () => {
    Object.defineProperty(window.location, "pathname", {
        writable: true
    })

    Object.defineProperty(window.location, "host", {
        writable: true
    })

    function matchRouteWithPath({ view, path, expected }) {
        window.location.pathname = path
        router((match) => expect(match({}, {}, {})).toBe(expected()), { view })
    }

    it("matches complete routes", () => {
        const view = {
            "/": _ => "Earth",
            "/home": _ => "Tokyo",
            "/repos/hyperapp": _ => "Godzilla",
            "/h/y/p/e/r/a/p/p": _ => "Supersonic",
            "*": _ => "Boston",
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
            "/:key": (model, actions, { key }) => `Key:${key}`,
            "/repos/:id": (model, actions, { id }) => `Repos/Id:${id}`,
            "/:a/:b/:c": (model, actions, { a, b, c }) => `a:${a}/b:${b}/c:${c}`,
            "*": _ => true,
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
            expected: view["*"]
        })
    })


    it("sets the location using setLocation", () => {
        const actions = {}

        window.history.pushState = (a, b, data) => expect(data).toBe("/foo")
        window.location.pathname = "/"

        router(match => match(42, actions), {
            view: {
                "/": (model, actions) => { },
                "/:key": (model, actions, { key }) => expect(key).toBe("foo")
            }
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

        router(match => match(42, {}), {
            view: {
                "/": Function.prototype,
                "/:key": (model, _, { key }) => {
                    expect(key).toBe("bar")
                    done()
                }
            }
        })

        window.location.pathname = "/bar"
        firePopstate()
    })

    it("intercepts href clicks", done => {
        // TODO: Divide href tests for simpler upkeep

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
        window.location.host = "hyperapp"

        router(match => match({}, {}), {
            view: {
                "/": Function.prototype,
                "/:key": (model, actions, { key }) => {
                    expect(key).toBe("foo")
                    done()
                }
            }
        })

        fireClick({ metaKey: true })
        fireClick({ altKey: true })
        fireClick({ ctrlKey: true })
        fireClick({ shiftKey: true })

        const a = document.createElement("a")
        a.id = "bar"
        document.body.appendChild(a)
        // a.scrollIntoView = _ => expect(0).toBe(0)

        fireClick({
            target: {
                hash: "#bar",
                localName: "a",
                host: "hyperapp",
                hasAttribute: Function.prototype
            }
        })

        fireClick({
            target: {
                parentNode: {
                    hash: "",
                    localName: "a",
                    host: "hyperapp",
                    pathname: "/foo",
                    hasAttribute: Function.prototype
                }
            }
        })
    })
})
