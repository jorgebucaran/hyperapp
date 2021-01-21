# @hyperapp/jsx

> Use JSX transforms with hyperapp

## Usage

#### Install:

```
npm install @hyperapp/jsx -D
```

#### Configure:

With `jsconfig.json` or `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@hyperapp/jsx"
  }
}
```

If using babel `@babel/preset-react` or `@babel/plugin-transform-react-jsx`:

```json
{
  "presets": [
    [
      "@babel/preset-react",
      {
        "runtime": "automatic",
        "importSource": "@hyperapp/jsx"
      }
    ]
  ]
}
```

Look [here](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#manual-babel-setup) for more info.

#### Use

```jsx
// No need to import the JSX runtime

const SomeViewFunction = (props) => (
  <div>
    <h1>Hello.</h1>
    <p>JSX is great!</p>
  </div>
);
```
