module.exports = function (path) {
    var keys = [], re = "^" + path
        .replace(/\//g, "\\/")
        .replace(/:([A-Za-z0-9_]+)/g, function (_, key) {
            keys.push(key)
            return "([A-Za-z0-9_]+)"
        }) + "/?$"

    return { re: re, keys: keys }
}
