export default function (app) {
  return {
    model: match(app.model, location.pathname),
    actions: {
      router: {
        match: match,
        go: function (_, data, actions) {
          history.pushState({}, "", data)
          actions.router.match(data)
        }
      }
    },
    hooks: {
      onRender: function (model) {
        return app.view[model.router.match]
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

  function match(model, data) {
    var match
    var params = {}

    for (var route in app.view) {
      var keys = []

      if (route !== "*") {
        data.replace(new RegExp("^" + route
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
      }

      if (match) {
        break
      }
    }

    return {
      router: {
        match: match || "*",
        params: params
      }
    }
  }
}


