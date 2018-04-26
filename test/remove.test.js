import { h, app } from "../src"
test("onremove reordering", function(done) {
  var theApp = app(
    {
      list: [0, 1, 2]
    },
    {
      change: function() {
        return function() {
          return {
            list: [0, 2]
          }
        }
      }
    },
    state => {
      return (
        <ul>
          {state.list.map(item => (
            <li key={item} onremove={(_, f) => setTimeout(f, 800)}>
              {item}
            </li>
          ))}
        </ul>
      )
    },
    document.body
  )
  setTimeout(() => {
    expect(document.body.innerHTML).toBe(
      "<ul><li>0</li><li>1</li><li>2</li></ul>"
    )
    theApp.change()
  }, 100)
  setTimeout(() => {
    expect(document.body.innerHTML).toBe(
      "<ul><li>0</li><li>1</li><li>2</li></ul>"
    )
  }, 500)
  setTimeout(() => {
    expect(document.body.innerHTML).toBe("<ul><li>0</li><li>2</li></ul>")
  }, 1100)
  setTimeout(done, 3000)
})
