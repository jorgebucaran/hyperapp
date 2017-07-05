import { h, app } from "../src"
import { expectHTMLToBe } from "./util"

beforeEach(() => (document.body.innerHTML = ""))

test("send messages to app", () => {
  const emit = app({
    state: "",
    view: state => h("div", {}, [state]),
    actions: {
      set: (state, actions, data) => data
    },
    events: {
      set: (state, actions, data) => actions.set(data)
    }
  })
  emit("set", "foo")

  expectHTMLToBe`
    <div>foo</div>
  `
})
