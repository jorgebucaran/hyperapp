# Router

To add routing to your application, use the <samp>Router</samp> plugin.

```jsx
import { Router } from "hyperapp"
```

The router treats the view as an object of key/value pairs where the key is a route, e.g. <samp>*</samp>, <samp>/home</samp> etc., and the value is the corresponding <samp>[view](/docs/api.md#view)</samp> function.

```jsx
app({
  view: {
    "*": state => <h1>404</h1>,
    "/": state => <h1>Hi.</h1>
  },
  plugins: [Router]
})
```

When the page loads or the browser fires a <samp>[popstate](https://developer.mozilla.org/en-US/docs/Web/Events/popstate)</samp> event, the view whose key/route matches <samp>[location.pathname](https://developer.mozilla.org/en-US/docs/Web/API/Location)</samp> is rendered. If there is no match, <samp>*</samp> is used as a fallback.


|route                    | <samp>location.pathname</samp>    |
|-------------------------|-----------------------------------|
| <samp>*</samp>          | Match if no other route matches.
| <samp>/</samp>          | /
| <samp>/:foo</samp>      | Match using the regular expression <samp>[A-Za-z0-9]+</samp>.</br>The params are stored in <samp>[state.router.params](#router-params)</samp>.


To navigate to a different route use <samp>[actions.router.go](#actions-go)</samp>.

## state
### <a name="state-params"></a> params

Type: <samp>{<i>foo</i>: string, ...}</samp>

The matched route params.

|route                        |<samp>location.pathname</samp> |state.router.params               |
|-----------------------------|-------------------------------|----------------------------------|
|<samp>/:foo</samp>           |/hyper                         | <samp>{ foo: "hyper" }</samp>    |

### <a name="state-match"></a> match

Type: <samp>string</samp>

The matched route.

## actions
### <a name="actions-go"></a> go

Type: <samp>([path](#router_go_path))</samp>
* **path**: <samp>string</samp>

Sets <samp>[location.pathname](https://developer.mozilla.org/en-US/docs/Web/API/Location)</samp> to <samp>path</samp>.

## events
### <a name="events-route"></a> route

Type: <samp>([state](/docs/api.md#state), [actions](/docs/api.md#actions), [data](#events-route-data), [emit](/docs/api.md#emit)) | Array\<[Type](#events-route)\></samp>

* <a name="events-route-data"></a>**data**
  * [params](#state-params)
  * [match](#state-match)

Fired when a route is matched.










