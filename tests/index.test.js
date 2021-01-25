import { h, text } from "../index.js"
import { t, deepEqual } from "twist"

export default [
  t("hyperapp", [
    t("hyperscript function", [
      t("create virtual nodes", [
        deepEqual(h("zord", { foo: true }, []), {
          children: [],
          key: undefined,
          node: undefined,
          props: {
            foo: true,
          },
          type: undefined,
          tag: "zord",
        }),
      ]),
    ]),
    t("text function", [
      deepEqual(text("hyper"), {
        children: [],
        key: undefined,
        node: undefined,
        props: {},
        type: 3,
        tag: "hyper",
      }),
    ]),
  ]),
]
