var regexify = require('./regexify')

module.exports = function (routes, path) {
    for (var route in routes) {
        var re = regexify(route), params = {}, match

        path.replace(new RegExp(re.re, "g"), function () {
            for (var i = 1; i < arguments.length - 2; i++) {
                params[re.keys.shift()] = arguments[i]
            }

            match = function (model, msg) {
                return routes[route](model, msg, params)
            }
        })

        if (match) {
            return match
        }
    }

    return routes["/"]
}
