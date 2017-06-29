export default function(app, view) {
  return {
    state: {
      router: match(location.pathname)
    },
    actions: {
      router: {
        match: function(state, actions, data, emit) {
          return {
            router: emit("route", match(data))
          }
        },
        go: function(state, actions, data) {
          history.pushState({}, "", data)
          actions.router.match(data.split("?")[0])
        }
      }
    },
    events: {
      loaded: function(state, actions) {
        match()
        addEventListener("popstate", match)

        function match() {
          actions.router.match(location.pathname)
        }
      },
      render: function() {
        return view
      }
    }
  }

  function match(data) {
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
      params: params
    }
  }
}
