import { html, app } from "flea"
import { Editor, getThemes, getModes } from "./editor"

const model = {
    lineNumbers: false,
    placeholder: "Type code here...",
    theme: "base16-light",
    mode: "javascript"
}

const view = (model, msg) => {
    return html`
        <div>
            <p>
                ${Editor({
                    mode: model.mode,
                    theme: model.theme,
                    lineNumbers: model.lineNumbers,
                    placeholder: model.placeholder
                }, msg.updateCode)}
            </p>

            <div>
                <select
                    style=${{textTransform: "capitalize"}}
                    onchange=${e => msg.selectTheme(e.target.value)}>${
                        getThemes().map(theme => html`
                            <option
                                value=${theme}
                                selected=${model.theme === theme}>${theme}
                            </option>`)}
                </select>

                <select
                    style=${{textTransform: "capitalize"}}
                    onchange=${e => msg.selectMode(e.target.value)}>${
                        getModes().map(mode =>
                            html`<option value=${mode}>${mode}</option>`)}
                </select>

                <label>
                    <input
                        onchange=${msg.toggleLineNumbers}
                        type="checkbox" checked=${model.lineNumbers} />Show line numbers
                </label>
            </div>
        </div>`
}

const update = {
    toggleLineNumbers: model => ({ ...model, lineNumbers: !model.lineNumbers }),
    selectTheme: (model, theme) => ({ ...model, theme }),
    selectMode: (model, mode) => ({ ...model, mode }),
    updateCode: (model, code) => ({ ...model, code })
}

app({ model, view, update })


