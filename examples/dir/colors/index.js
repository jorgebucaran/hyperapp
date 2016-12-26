import { html, app } from "flea"
import colors from "./colors"

const model = {
    color: "red"
}

const hexToRgb = hex => {
    const num = parseInt(hex.replace(/^#/, ""), 16)
    return [num >> 16, num >> 8 & 255, num & 255]
}

const isDark = rgb => Math.round((
    parseInt(rgb[0]) * 299 +
    parseInt(rgb[1]) * 587 +
    parseInt(rgb[2]) * 114) / 1000) <= 140

const view = (model, msg) => {
    const topRow = html`
        <div style=${{
            display: "flex",
            order: 1,
            margin: "5px 0"
        }}>
            ${Object.keys(colors).map(key => {
                return html`
                    <div
                        onmouseover=${_ => msg.changeColor(key)}
                        style=${{
                            boxSizing: "border-box",
                            order: 1,
                            backgroundColor: colors[key][500],
                            width: "10%",
                            height: "5%",
                            cursor: "pointer",
                            border: key === model.color ? "2px solid white" : "none"
                        }}>
                    </div>`
            })}
        </div>`

    const bottomRow = html`
        <div style=${{
            display: "flex",
            flexDirection: "column",
            order: 2
        }}>
            ${Object.keys(colors[model.color]).reverse().map(shade => html`
                <div
                    style=${{
                        backgroundColor: colors[model.color][shade],
                        height: "8%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: "0 20px",
                        color: isDark(hexToRgb(colors[model.color][shade])) ? "white" : "black"
                }}>
                    <div style=${{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        fontFamily: "sans-serif",
                        fontWeight: "800"
                    }}>
                        <div>${colors[model.color][shade]}</div>
                        <div>${shade}</div>
                    </div>
                </div>`
            )}
        </div>`


    return html`
        <div style=${{
            display: "flex",
            flexDirection: "column"
        }}>
            ${topRow}
            ${bottomRow}
        </div>`
}

const update = {
    changeColor: (model, color) => ({ ...model, color })
}

app({ model, view, update })


