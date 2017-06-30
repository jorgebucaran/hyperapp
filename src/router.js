function Router(getLocation, subscribe, goTo) {
  return function(app) {
    return {
      state: {
        router: match(app, getLocation())
      },
      actions: {
        router: {
          match: function(state, actions, data, emit) {
            return {
              router: emit("route", match(app, data))
            }
          },
          go: function(state, actions, data) {
            goTo(data)
            actions.router.match(data)
          }
        }
      },
      events: {
        loaded: function(state, actions) {
          match()
          subscribe(match)

          function match() {
            actions.router.match(getLocation())
          }
        },
        render: function(state) {
          return state.router.view
        }
      }
    }
  }
}

function match(app, data) {
  var view
  for (var match, params = {}, i = 0, len = app.view.length; i < len; i++) {
    var route = app.view[i][0]
    var keys = []

    if (!match) {
      data.replace(
        RegExp(
          route === "*"
            ? "." + route
            : "^" +
                route
                  .replace(/\//g, "\\/")
                  .replace(/:([\w]+)/g, function(_, key) {
                    keys.push(key)
                    return "([-\\.%\\w]+)"
                  }) +
                "/?$",
          "g"
        ),
        function() {
          for (var j = 1; j < arguments.length - 2; ) {
            params[keys.shift()] = arguments[j++]
          }
          match = route
          view = app.view[i][1]
        }
      )
    }
  }

  return {
    match: match,
    params: params,
    view: view
  }
}

var BrowserRouter = Router(
  function getLocation() {
    return location.pathname
  },
  function subscribe(cb) {
    addEventListener("popstate", cb)
  },
  function goTo(data) {
    history.pushState({}, "", data)
  }
)
BrowserRouter.Hash = Router(
  function getLocation() {
    return (location.hash || "/").replace(/^#/, "")
  },
  function subscribe(cb) {
    addEventListener("hashchange", cb)
  },
  function goTo(data) {
    location.hash = "#" + data
  }
)

export default BrowserRouter
