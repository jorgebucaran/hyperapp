import { app, html } from "flea"

// console.log("Move around the screen to change")

const effects = {
    randomColor: _ =>
        document.body.style.backgroundColor = "#" + ((1<<24) * Math.random() | 0).toString(16)
}

const subs = [
    msg => addEventListener("mousemove", msg.randomColor)
]

app({ effects, subs })
