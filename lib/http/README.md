# @hyperapp/http

Make HTTP requests from Hyperapp.

## Installation

```console
npm i @hyperapp/http
```

## Usage

```js
import { get } from "@hyperapp/http"

const GotResult = (state, { result }) => ({ ...state, result })

const factor = expression =>
  get({
    url: `https://newton.now.sh/factor/${expression}`,
    expect: "json",
    action: GotResult
  })
```

## License

[MIT](../../LICENSE.md)
