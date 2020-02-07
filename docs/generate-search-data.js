const path = require("path")
const glob = require("glob")
const fs = require("fs")

// Generate a big JSON file of all the text of all pages, used for search
glob("src/pages/**/*.md", {}, (err, files) => {
  const data = files.reduce((data, filePath) => {
    const content = fs.readFileSync(path.join(__dirname, filePath), "utf8")
    const pageName = path.basename(filePath, ".md")
    return {
      ...data,
      [pageName]: content
    }
  }, {})
  fs.writeFileSync("static/pages-data.json", JSON.stringify(data))
})
