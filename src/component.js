import { merge } from './tools'

function _component(mediator) {

  var emit = (name, data) => mediator.get("emit", { name, data })
  var render = (state, view) => mediator.set("render", { state, view })

  return function (component) {
    var componentName = component.name // different (add)
    var states = [] // different (change)
    // state could be primitive, array, object or function(props) returning
    // primitive, array or object (we need array for keeping functions)
    var view = component.view
    var actions = {}
    var events = {}
    var node
    var element

    for (var i = -1, mixins = component.mixins || []; i < mixins.length; i++) {
      var mixin = mixins[i] ? mixins[i](component) : component

      if (mixin.mixins != null && mixin !== component) {
        mixins = mixins.concat(mixin.mixins)
      }

      if (mixin.state != null) {
        states.push(mixin.state) // different (change)
      }

      init(actions, mixin.actions)

      Object.keys(mixin.events || []).map(function (key) {
        events[key] = (events[key] || []).concat(mixin.events[key])
      })
    }

    // TODO: how to properly assign state? Is it better to store component actions far every instance?
    function init(namespace, children, lastName) {
      Object.keys(children || []).map(function (key) {
        var action = children[key]
        var name = lastName ? lastName + "." + key : key

        if (typeof action === "function") {
          namespace[key] = function (state) { // different (add): before calling we need assign instance state (performance?)
            return function (data) {
              var result = action(
                state,
                actions,
                emit("action", {
                  name: name,
                  data: data
                }).data,
                emit
              )

              if (result == null || typeof result.then === "function") {
                return result
              }

              render((state = merge(state, emit("update", result))), view)
            }
          }
        } else {
          init(namespace[key] || (namespace[key] = {}), action, name)
        }
      })
    }

    return function (props, children) {
      var instanceId
      var instanceState
      var instanceActions // TODO
      if (props.id) { // if you insert ID of instance
        instanceId = componentName + "_" + props.id
        instanceState = mediator.get("componentState", instanceId)
          || states.reduce((state, partial) =>
            typeof partial === "function"
              ? merge(state, partial(props))
              : merge(state, partial))
        return component.view(instanceState, instanceActions, props, children)
      } else {
        return (
          <div>Missing id</div>
        )
      }
    }
  }
}

export {
  _component
}
