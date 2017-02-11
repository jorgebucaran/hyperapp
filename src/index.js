var h = require("./h")

module.exports = {
    router: require("./router"),
    html: require("hyperx")(h),
    app: require("./app"),
    h: h
}
