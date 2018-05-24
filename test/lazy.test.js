import { h, app } from "../src"

test("Lazy component can return array", function(done) {
  var Component = function() {
    return function() {
      return [<p />]
    }
  }
  app(
    {},
    {},
    function() {
      return (
        <div
          oncreate={function() {
            expect(document.body.innerHTML).toBe("<div><p></p></div>")
            done()
          }}
        >
          <Component />
        </div>
      )
    },
    document.body
  )
})
