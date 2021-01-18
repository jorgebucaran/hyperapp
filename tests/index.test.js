import { h, text } from "../index.js"
import { t, deepEqual } from "twist"

export default [
  t("hyperapp", [
    t("hyperscript function", [
      t("create virtual nodes", [
        deepEqual(h("zord", { foo: true }, []), {
          children: [],
          key: undefined,
          node: null,
          props: {
            foo: true,
          },
          tag: undefined,
          type: "zord",
        }),
      ]),
    ]),
    t("text function", [
      deepEqual(text("tenet"), {
        children: [],
        key: null,
        node: undefined,
        props: {},
        tag: 3,
        type: "tenet",
      }),
    ]),
  ]),
]
