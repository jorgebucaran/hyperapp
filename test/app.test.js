import { h, app } from "../src"
import { expectHTMLToBe } from "./util"

beforeEach(() => (document.body.innerHTML = ""))

test("send messages to app", () => {
  const send = app({
    view: state => h("div", {}, [state]),
    state: "",
    actions: {
      set: (state, actions, str) => str
    },
    events: {
      "info:set": (state, actions, str) => actions.set(str)
    }
  })
  send("info:set", "testinfo")
  expectHTMLToBe`<div>testinfo</div>`
})