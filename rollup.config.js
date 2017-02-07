import buble from "rollup-plugin-buble"
import uglify from "rollup-plugin-uglify"
import cjs from "rollup-plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"

export default {
    plugins: [
        buble(),
        cjs(),
        resolve(),
        uglify()
    ]
}