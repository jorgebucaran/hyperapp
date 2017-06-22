import h from "./h"
import { mediator } from './tools'
import _app from "./app"
import { _component } from './component'
import Router from "./router"

var app = _app(mediator)
var component = _component(mediator)

export { h, app, component, Router }
