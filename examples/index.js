#!/usr/bin/env node

const PORT = process.env.PORT || 8080

const http = require("http")
const fs = require("fs")
const path = require("path")

const browserify = require("browserify")
const babelify = require("babelify")

const html = require("hyperx")(require("hyperscript"))

const getDirectories = (dir) =>
    fs.readdirSync(dir).filter(file =>
        fs.statSync(path.join(dir, file)).isDirectory())

const routes = getDirectories(__dirname + "/dir/")

http.createServer((req, res) => {
    if (req.url === "/") {
        res.write(html`
            <body>
                <ul>${
                    routes.map(name => html`
                        <li><a href="${name}">${name}</a></li>`)
                }</ul>
            </body>`.outerHTML
        )
        res.end()
        return
    }

    const match = req.url.match(/^\/static\/([a-z0-9]+)\/bundle\.js$/)

    if (match && match.length >= 1) {
        res.setHeader("content-type", "application/javascript")
        browserify(`${__dirname}/dir/${match[1]}/index.js`)
            .transform(babelify, {
                presets: ["latest"],
                plugins: ["transform-object-rest-spread"]
            })
            .bundle()
            .on("error", e => {
                console.error(e)
                res.writeHead(500, e.toString())
                res.end()
            })
            .pipe(res)
        return
    }

    const filterRoutes = routes.filter(name => `/${name}` === req.url)

    if (filterRoutes.length === 0) {
        res.setHeader("content-type", "application/json")
        res.writeHead(404, "not found")
        res.write(JSON.stringify({
            error: 404,
            message: "not found",
            resource: req.url
        }))
        res.end()
        return
    }

    filterRoutes.forEach(name => {
        res.write(`
            <body>
                <script src="static/${name}/bundle.js"></script>
            </body>`)
        res.end()
        return
    })

}).listen(PORT, _ => console.log(`Listening on port ${PORT}`))

