<<<<<<< HEAD
import h from "./h"
import { mediator } from './tools'
import _app from "./app"
import { _component } from './component'
import Router from "./router"

var app = _app(mediator)
var component = _component(mediator)

export { h, app, component, Router }
=======
import outerEvents from './outerEvents'
import connectH from "./h"
import connectApp from "./app"
import Router from "./router"

const h = connectH(outerEvents)
const app = connectApp(outerEvents)

export { h, app, Router }
>>>>>>> c99d8e3a6401410b813699e5e2271514e7b5ff6f
