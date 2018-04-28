import { h, app } from "../src"
var changeApp = (changer, ...args) =>
  new Promise(resolve => {
    changer && changer.apply(null, args)
    setTimeout(resolve, 100)
  })
test("onremove reordering", function(done) {
  var removers = [],
    theApp = app(
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
              <li key={item} onremove={(_, f) => removers.push(f)}>
                {item}
              </li>
            ))}
          </ul>
        )
      },
      document.body
    )

  changeApp()
    .then(() => {
      expect(document.body.innerHTML).toBe(
        "<ul><li>0</li><li>1</li><li>2</li><li>3</li></ul>"
      )
      return changeApp(theApp.change)
    })
    .then(() => {
      expect(document.body.innerHTML).toBe(
        "<ul><li>0</li><li>1</li><li>2</li><li>3</li></ul>"
      )
    })
    .then(() => {
      removers.forEach(f => f())
      removers = []
      expect(document.body.innerHTML).toBe("<ul><li>2</li><li>3</li></ul>")
      return changeApp(theApp.changeAgain)
    })
    .then(() => {
      removers.forEach(f => f())
      removers = []
      expect(document.body.innerHTML).toBe("<ul><li>2</li><li>4</li></ul>")
    })
    .then(done)
})
