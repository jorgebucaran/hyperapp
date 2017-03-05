/* global describe, it, expect */

import { app, h } from "../src"
import hyperx from "hyperx"
const html = hyperx(h)

describe("hyperx", () => {
  it("renders a vnode tree", () => {
    expect(html`<div id="foo">bar</div>`)
      .toEqual({
        tag: "div",
        data: {
          id: "foo"
        },
        children: ["bar"]
      })
  })

  it("renders a vnode tree with a loop", () => {
    expect(html`<ul>${["foo", "bar", "baz"].map(i => html`<li>${i}</li>`)}</ul>`)
      .toEqual({
        tag: "ul",
        data: {},
        children: [
          {
            tag: "li",
            data: {},
            children: ["foo"]
          },
          {
            tag: "li",
            data: {},
            children: ["bar"]
          },
          {
            tag: "li",
            data: {},
            children: ["baz"]
          }
        ]
      })
  })

  it("classname vs class (see #128)", () => {
    app({
      model: true,
      view: (model, actions) => html`<div>${model
        ? html`<div class="foo">bar</div>`
        : html`<div>bar</div>`}</div>`,
      actions: {
        toggle: model => !model
      },
      subscriptions: [
        (_, actions) => {
          expect(document.body.innerHTML)
            .toBe(`<div><div><div classname="foo" class="foo">bar</div></div></div>`)

          actions.toggle()

          expect(document.body.innerHTML)
            .toBe(`<div><div><div classname="foo">bar</div></div></div>`)
        }
      ]
    })
  })
})
