# @hyperapp/jsx

Use JSX [Automatic Runtime](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#manual-babel-setup) with hyperapp

## Install:

```
npm install @hyperapp/jsx -D
```

## Configure:

With `tsconfig.json` or `jsconfig.json` (TypeScript >v4.1):

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@hyperapp/jsx"
  }
}
```

If using `@babel/preset-react` >v7.9.0 :

```json
{
  "presets": [
    ["@babel/preset-react", {
      "runtime": "automatic",
      "importSource": "@hyperapp/jsx"
    }]
  ]
}
```

If using `@babel/plugin-transform-react-jsx` >v7.9.0

```json
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "runtime": "automatic",
      "importSource": "@hyperapp/jsx"
    }]
  ]
}
```

Look [here](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) for more info.

## Use

```jsx
// No need to import the JSX runtime

const SomeViewFunction = (props, children) => (
  <div>
    <span>Hello, I can receive children via JSX children syntax</span>
    {children}
  </div>
);

const SomeOtherViewFunction = (props) => (
  <div>
    <h1>Hello.</h1>
    <p>JSX is great!</p>
    <SomeOtherViewFunction>
      <p>Children node</p>
    </SomeOtherViewFunction>
    <AnotherComponent foo="bar" prop={2 + 4} />
    <>
      Fragments are also supported!
    <>
  </div>
);


```
