export default function(app) {
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
      render: function(state, actions, view) {
        for (var i = 0, len = view.length; i < len; i++) {
          var route = view[i]
          if (route.path === state.router.match) {
            return route.view
          }
        }
      }
    }
  }

  function match(path) {
    var match
    var params = {}

    for (var i = 0, len = app.view.length; i < len; i++) {
      var routePath = app.view[i].path
      var keys = []

      if (!match && routePath !== "*") {
        path.replace(
          RegExp(
            "^" +
              routePath
                .replace(/\//g, "\\/")
                .replace(/:([\w]+)/g, function(_, key) {
                  keys.push(key)
                  return "([-\\.\\w]+)"
                }) +
              "/?$",
            "g"
          ),
          function() {
            for (var i = 1; i < arguments.length - 2; ) {
              params[keys.shift()] = arguments[i++]
            }
            match = routePath
          }
        )
      }
    }

    return {
      match: match || "*",
      params: params
    }
  }
}
