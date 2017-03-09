export default function (options) {
  var lastMatch;
  return {
    model: {
      router: match(options.view, location.pathname)
    },
    actions: {
      router: {
        match: function (_, data) {
          return {
            router: match(options.view, data)
          }
        },
        go: function (model, data, actions) {
          history.pushState({}, "", data)
          actions.router.match(data)
          var route = match(options.view, data).match
          if (typeof options.view[route][1] === 'function') {
            options.view[route][1](model, actions)
          }
        }
      }
    },
    hooks: {
      onRender: function (model) {
        return options.view[model.router.match][0]
      }
    },
    subscriptions: [
      function (_, actions) {
        addEventListener("popstate", function () {
          actions.router.match(location.pathname)
        })
      }
    ]
  }
}

function match(routes, path) {
  var match, params = {}

  for (var route in routes) {
    var keys = []

    if (route === "*") {
      continue
    }

    path.replace(new RegExp("^" + route
      .replace(/\//g, "\\/")
      .replace(/:([A-Za-z0-9_]+)/g, function (_, key) {
        keys.push(key)
        return "([-A-Za-z0-9_]+)"
      }) + "/?$", "g"), function () {

        for (var i = 1; i < arguments.length - 2; i++) {
          params[keys.shift()] = arguments[i]
        }
        match = route
      })

    if (match) {
      break
    }
  }

  return {
    match: match || "*",
    params: params
  }
}
