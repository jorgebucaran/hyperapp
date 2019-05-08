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

- This package is suited for recurring tasks, not for animation. Use `@hyperapp/raf`, which is based on [`requestAnimationFrame`] for smooth animations.

## License

[MIT](../../LICENSE.md)
