## quickstart

1․ Install Hyperapp with npm or Yarn:

---
```console
npm i hyperapp
```
---




2․ Then with a module bundler like [Parcel](https://parceljs.org) or [Webpack](https://webpack.js.org) import it in your application and get right down to business.

---
```js
import { h, app } from "hyperapp"
```
---




3․ Don't want to set up a build step? Import Hyperapp in a `<script>` tag as a module. Don't worry; modules are supported in all evergreen, self-updating desktop, and mobile browsers.

---
```html
<script type="module">
  import { h, app } from "https://unpkg.com/hyperapp"
</script>
```
---




Here's the first example to get you started: a counter that can go up or down. You can try it online [here](https://codesandbox.io/s/hyperapp-playground-fwjlo).

---