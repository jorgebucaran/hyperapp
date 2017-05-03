# Routing

To add routing to your application, use the Router plugin.

```jsx
import { Router } from "hyperapp"
```

The router treats the view as an object of key/value pairs where the key is a route, e.g. <samp>*</samp>, <samp>/home</samp> etc., and the value is the corresponding [view](/docs/api.md#view) function.

```jsx
app({
  view: {
    "*": state => <h1>404</h1>,
    "/": state => <h1>Hi.</h1>
  },
  plugins: [Router]
})
```

When the page loads or the browser fires a [popstate](https://developer.mozilla.org/en-US/docs/Web/Events/popstate) event, the view whose key/route matches [location.pathname](https://developer.mozilla.org/en-US/docs/Web/API/Location) will be rendered. If there is no match, <samp>*</samp> is used as a fallback.

<a name="router-route"></a>

|route                    | location.pathname    |
|-------------------------|-----------------------------------|
| <samp>*</samp>          | Match if no other route matches.
| <samp>/</samp>          | <samp>/</samp>
| <samp>/:foo</samp>      | Match <samp>[A-Za-z0-9]+</samp>. See [params](#router-params).


To navigate to a different route use [actions.router.go](#actions-go).

## state
### <a name="state-params"></a>params

Type: { <i>foo</i>: string, ... }

The matched route params.

|route                 |location.pathname    |state.router.params  |
|----------------------|---------------------|---------------------|
|<samp>/:foo</samp>    |<samp>/hyper</samp>  | { foo: "hyper" }    |

### <a name="state-match"></a>match

Type: string

The matched route.

## actions
### <a name="actions-go"></a>go

Type: ([path](#router_go_path))
* path: string

Update [location.pathname](https://developer.mozilla.org/en-US/docs/Web/API/Location).

## events
### <a name="events-route"></a>route

Type: ([state](/docs/api.md#state), [actions](/docs/api.md#actions), [data](#events-route-data), [emit](/docs/api.md#emit)) | [route](#events-route)\[\]

* <a name="events-route-data"></a>data
  * [params](#state-params)
  * [match](#state-match)

Fired when a route is matched.










