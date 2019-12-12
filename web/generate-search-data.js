const path = require('path')
const glob = require('glob')
const fs = require('fs')


glob("src/pages/**/*.md", {}, (err, files) => {
  const data = {}
  files.forEach(file => {
    const content = fs.readFileSync(__dirname + '/' + file, 'utf8')
    const filename = path.basename(file, '.md')
    data[filename] = content
  })

  const dir = './functions';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  fs.writeFileSync('functions/search.js', `
exports.handler = async (event, context) => {
  const query = event.queryStringParameters.query
  const data = ${JSON.stringify(data)};
  const pages = Object.keys(data).filter(page => data[page].includes(query))
  return {
    statusCode: 200,
    body: JSON.stringify(pages)
  }
}`)

})

