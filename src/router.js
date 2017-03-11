export default function (options) {
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
        go: function (_, data, actions) {
          history.pushState({}, "", data)
          actions.router.match(data)
        }
      }
    },
    hooks: {
      onUpdate: function (oldModel, newModel, data, actions) {
        if(newModel.router && oldModel.router.path !== newModel.router.path &&
            typeof options.view[newModel.router.match][1] === 'function') {
          options.view[newModel.router.match][1](newModel, actions)
        }
      },
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
    params: params,
    path: path
  }
}
