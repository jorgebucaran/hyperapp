import { h, app } from "../src"
test("onremove reordering", function(done) {
  var theApp = app(
    {
      list: [0, 1, 2, 3]
    },
    {
      change: function() {
        return function() {
          return {
            list: [2, 3]
          }
        }
      },
      changeAgain: function() {
        return function() {
          return {
            list: [2, 4]
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
      "<ul><li>0</li><li>1</li><li>2</li><li>3</li></ul>"
    )
    theApp.change()
  }, 100)
  setTimeout(() => {
    expect(document.body.innerHTML).toBe(
      "<ul><li>0</li><li>1</li><li>2</li><li>3</li></ul>"
    )
    theApp.changeAgain()
  }, 500)
  setTimeout(() => {
    expect(document.body.innerHTML).toBe("<ul><li>2</li><li>4</li></ul>")
  }, 1600)
  setTimeout(done, 3000)
})
