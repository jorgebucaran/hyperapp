import uglify from "rollup-plugin-uglify"

export default {
    plugins: [
        uglify({
            compress: {
                collapse_vars: true,
                pure_funcs: ["Object.defineProperty"]
            }
        })
    ]
}
