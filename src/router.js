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
      onRender: function (model) {
        return options.view[model.router.match]
      }
    },
    subscriptions: [
      function (_, actions) {
        addEventListener("popstate", function () {
          actions.router.match(location.pathname)
        })
      },
      function (_, actions) {
        addEventListener("click", function (e) {
          if (e.metaKey || e.shiftKey || e.ctrlKey || e.altKey) return
          var target = e.target
          while (target && target.localName !== "a") {
            target = target.parentNode
          }
          if (target && target.host === location.host && !target.hasAttribute("data-no-routing")) {
            var element = document.querySelector(target.hash === "" ? element : target.hash)
            if (element) {
              element.scrollIntoView(true)
            } else {
              e.preventDefault()
              actions.router.go(target.pathname)
            }
          }
        })
      },
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
        return "([A-Za-z0-9_]+)"
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
