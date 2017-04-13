export default function (app) {
  return {
    actions: {
      router: {
        match: function (state, data, actions, emit) {
          return {
            router: match(data, emit)
          }
        },
        go: function (state, data, actions) {
          history.pushState({}, "", data)
          actions.router.match(data)
        }
      }
    },
    events: {
      loaded: function (state, actions) {
        addEventListener("popstate", function () {
          actions.router.match(location.pathname)
        })
      },
      render: function (state, actions, view, emit) {
        return view[(state.router || (
          state.router = match(location.pathname, emit))).match]
      }
    }
  }

  function match(data, emit) {
    var match
    var params = {}

    for (var route in app.view) {
      var keys = []

      if (!match && route !== "*") {
        data.replace(new RegExp("^" + route
          .replace(/\//g, "\\/")
          .replace(/:([A-Za-z0-9_]+)/g, function (_, key) {
            keys.push(key)

            return "([-A-Za-z0-9_]+)"
          }) + "/?$", "g"), function () {

            for (var i = 1; i < arguments.length - 2;) {
              params[keys.shift()] = arguments[i++]
            }

            match = route
          })
      }
    }

    return emit("route", {
      match: match || "*",
      params: params
    })
  }
}

