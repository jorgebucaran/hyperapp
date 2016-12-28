import { html } from "flea"

import CodeMirror from "codemirror"

import "codemirror/addon/display/placeholder"

import "codemirror/mode/javascript/javascript"
import "codemirror/mode/css/css"
import "codemirror/mode/clike/clike"
import "codemirror/mode/go/go"
import "codemirror/mode/haskell/haskell"
import "codemirror/mode/perl/perl"
import "codemirror/mode/php/php"
import "codemirror/mode/python/python"
import "codemirror/mode/ruby/ruby"

import "./style.css"

const node = document.createElement("div")
const editor = CodeMirror(node)

const Editor = (options, updateCode) => {
    const setOptions = options =>
        Object.keys(options).forEach(key => editor.setOption(key, options[key]))

    const insertHook = vnode => {
        setOptions(options)
        editor.on("change", e => updateCode(e.getValue()))
        vnode.elm.appendChild(node)

        //editor.focus()
        //editor.refresh()
    }

    const updateHook = _ => setOptions(options)

    return html`
        <div
            data-hook-insert=${insertHook}
            data-hook-update=${updateHook}>
        </div>`
}

const getThemes = _ => [
    "default",
    "3024-day",
    "3024-night",
    "abcdef",
    "ambiance",
    "base16-dark",
    "base16-light",
    "bespin",
    "blackboard",
    "cobalt",
    "colorforth",
    "dracula",
    "duotone-dark",
    "duotone-light",
    "eclipse",
    "elegant",
    "erlang-dark",
    "hopscotch",
    "icecoder",
    "isotope",
    "lesser-dark",
    "liquibyte",
    "material",
    "mbo",
    "mdn-like",
    "midnight",
    "monokai",
    "neat",
    "neo",
    "night",
    "panda-syntax",
    "paraiso-dark",
    "paraiso-light",
    "pastel-on-dark",
    "railscasts",
    "rubyblue",
    "seti",
    "solarized dark",
    "solarized light",
    "the-matrix",
    "tomorrow-night-bright",
    "tomorrow-night-eighties",
    "ttcn",
    "twilight",
    "vibrant-ink",
    "xq-dark",
    "xq-light",
    "yeti",
    "zenburn"
]

const getModes = _ => [
    "javascript",
    "clike",
    "haskell",
    "perl",
    "php",
    "python",
    "ruby",
    "go",
    "css"
]

export { getThemes, getModes, Editor }