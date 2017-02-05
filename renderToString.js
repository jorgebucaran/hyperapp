var escape = require('escape-html')
var paramCase = require('param-case')
var createAttribute = require('vdom-to-html/create-attribute')
var voidElements = require('vdom-to-html/void-elements')

var createMsg = require('./utils/createMsg')
var createHooks = require('./utils/createHooks')
var isPrimitive = require('./utils/isPrimitive')
var getViewForRoute = require('./utils/getViewForRoute')
var merge = require('./utils/merge')

function createHTMLStringFrom(node, parent) {
  if (!node) return ''

  if (isPrimitive(typeof node)) {
      if (parent && (parent.tag === 'script' || parent.tag === 'style'))
          return String(node)

      return escape(String(node))
  }

  return openTag(node) + tagContent(node) + closeTag(node)
}

function openTag(node) {
    var props = node.data
    var ret = '<' + node.tag

    for (var name in props) {
        var value = props[name]
        if (value == null) continue

        if (name.startsWith('data-')) {
            value = merge({}, value)
            ret += ' ' + createAttribute(name, value, true)
            continue
        }

        if (name == 'style') {
            var css = ''
            value = merge({}, value)
            for (var styleProp in value) {
                css += paramCase(styleProp) + ': ' + value[styleProp] + '; '
            }
            value = css.trim()
        }

        var attr = createAttribute(name, value)
        if (attr) ret += ' ' + attr
    }

    return ret + '>'
}

function tagContent(node) {
    var ret = ''
    for (var i = 0; i < node.tree.length; i++) {
        ret += createHTMLStringFrom(node.tree[i], node)
    }
    return ret
}

function closeTag(node) {
    var tag = node.tag
    return voidElements[tag] ? '' : '</' + tag + '>'
}

module.exports = function (options, pathname) {
  var hooks = createHooks(options)
  var msg = createMsg(options, hooks, function () {})
  var routes = typeof options.view === 'object' ? options.view : null
  var view = routes ? getViewForRoute(routes, pathname) : options.view

  return createHTMLStringFrom(view(options.model, msg))
}
