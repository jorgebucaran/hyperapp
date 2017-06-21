import outerEvents from './outerEvents'
import connectH from "./h"
import connectApp from "./app"
import Router from "./router"

const h = connectH(outerEvents)
const app = connectApp(outerEvents)

export { h, app, Router }
