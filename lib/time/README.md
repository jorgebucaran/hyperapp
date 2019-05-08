# @hyperapp/time

Time effects and subscriptions for Hyperapp.

## Installation

<pre>
npm i <a href=https://www.npmjs.com/package/@hyperapp/time>@hyperapp/time</a>
</pre>

## Usage

```jsx
import { every } from "@hyperapp/time"

app({
  subscriptions: state => [every({ action: Tick, interval: 1000 })]
})
```

## Notes

- This package is best suited for recurring tasks, not for animation. Check out `@hyperapp/raf`, which is based on [`requestAnimationFrame`], to create smooth animations and games.

## License

[MIT](../../LICENSE.md)
