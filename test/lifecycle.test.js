import { h, app } from "../src"

test("onCreate", done => {
  app({
    state: 1,
    view: state =>
      <div
        onCreate={e => {
          expect(state).toBe(1)
          done()
        }}
      >
      </div>
  })
})

test("onUpdate", done => {
  app({
    state: 1,
    view: state =>
      <div
        onUpdate={e => {
          expect(state).toBe(2)
          done()
        }}
      >
      </div>,
    actions: {
      add: state => state + 1
    },
    events: {
      loaded: (state, actions) => actions.add()
    }
  })
})

test("onRemove", done => {
  app({
    state: true,
    view: state => state
      ?
      <ul>
        <li>foo</li>
        <li onRemove={done}></li>
      </ul>
      :
      <ul>
        <li>foo</li>
      </ul>,
    actions: {
      toggle: state => !state
    },
    events: {
      loaded: (state, actions) => actions.toggle()
    }
  })
})
