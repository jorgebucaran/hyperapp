import { h } from ".."
import { deepEqual } from "testmatrix"

export default {
  h: [
    {
      name: "first test",
      assert: deepEqual,
      actual: h("h1", { id: "title" }, "hello"),
      expected: {
        name: "h1",
        props: { id: "title" },
        children: [
          {
            name: "hello",
            props: {},
            children: [],
            node: undefined,
            type: 3,
            key: undefined
          }
        ],
        node: undefined,
        type: undefined,
        key: undefined
      }
    }
  ]
}
