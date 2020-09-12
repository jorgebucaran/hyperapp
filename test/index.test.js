import { h } from "../index.js"
import { t, deepEqual } from "twist"

export default [
  t("hyperapp", [
    t("hyperscript function", [
      t("create virtual nodes", [
        deepEqual(h("x", { foo: true }, []), {
          children: [],
          key: undefined,
          node: null,
          props: {
            foo: true,
          },
          tag: undefined,
          type: "x",
        }),
      ]),
    ]),
    t("text function", []),
  ]),
]
