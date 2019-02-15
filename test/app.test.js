import { app, h } from "../src"

test("mounts headless", () => {
  expect(() => {
    app({
      init: 'foo',
      view: (state) => h("div", null, state),
      update: (_, state) => state,
    });
  }).not.toThrow()
})
