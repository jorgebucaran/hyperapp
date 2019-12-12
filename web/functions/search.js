
exports.handler = async (event, context) => {
  const query = event.queryStringParameters.query
  const data = {"api":"# api\nlorem ipsum...","ecosystem":"# ecosystem\nlorem ipsum...","guides":"# guides\nlorem lorem","quickstart":"## quickstart\n\n1․ Install Hyperapp with npm or Yarn:\n\n---\n```console\nnpm i hyperapp\n```\n---\n\n\n\n\n2․ Then with a module bundler like [Parcel](https://parceljs.org) or [Webpack](https://webpack.js.org) import it in your application and get right down to business.\n\n---\n```js\nimport { h, app } from \"hyperapp\"\n```\n---\n\n\n\n\n3․ Don't want to set up a build step? Import Hyperapp in a `<script>` tag as a module. Don't worry; modules are supported in all evergreen, self-updating desktop, and mobile browsers.\n\n---\n```html\n<script type=\"module\">\n  import { h, app } from \"https://unpkg.com/hyperapp\"\n</script>\n```\n---\n\n\n\n\nHere's the first example to get you started: a counter that can go up or down. You can try it online [here](https://codesandbox.io/s/hyperapp-playground-fwjlo).\n\n---","sponsor":"# sponsor\nlorem lorem lorem","tutorial":"# tutorial\nlorem"};
  const pages = Object.keys(data).filter(page => data[page].includes(query))
  return {
    statusCode: 200,
    body: JSON.stringify(pages)
  }
}