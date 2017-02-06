const {rollup} = require('rollup');

const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

const buble = require('rollup-plugin-buble');
const uglify = require('rollup-plugin-uglify');

const {compress} = require('node-zopfli');

const {writeFile, statSync} = require('fs');
const bytes = require('bytes');
const columnify = require('columnify');

const mkdirp = require('mkdirp');

const outputs = {
    app: './src/app.js',
    html: './src/html.js',
    h: './src/h.js'
};

mkdirp('./dist/', e => {
    if (e != null) throw e;

    Promise.all(
        Object.keys(outputs)
            .map(moduleName => build(outputs[moduleName], moduleName))
            .concat(build('./src/index.js', 'hyperapp'))
    )
        .then(data => {
            console.log(columnify(data.reduce((r, v) => ([...r, ...v]), [])));
        })
});

/**
 * @name build
 * 
 * @param {string} entry a file name on disk
 * @param {string} moduleName the name of the output iife
 * 
 * @returns undefined
 */
function build(entry, moduleName) {
    const output = [];

    return new Promise(resolve => {
        rollup({
            entry,
            useStrict: false,
            plugins: [
                nodeResolve(),
                commonjs(),
                buble(),
                uglify()
            ]
        })
            .then(bundle => {
                const {code} = bundle.generate({
                    format: 'iife',
                    moduleName
                });

                const outputBase = `./dist/${moduleName}`;

                const outputFile = `${outputBase}.min.js`;

                // Standard file
                writeFile(outputFile, code);

                output.push({
                    moduleName,
                    outputFile,
                    size: bytes(Buffer.byteLength(code, 'utf-8'))
                });

                // Compressed output
                const z = new Buffer(code);
                compress(z, 'zlib', (e, data) => {
                    if (e != null) throw e;

                    const outputFile = `${outputBase}.min.js.gz`;

                    writeFile(outputFile, data);

                    output.push({
                        moduleName,
                        outputFile,
                        size: bytes(Buffer.byteLength(data))
                    });

                    resolve(output);
                });

            })
            .catch(e => {
                if (e != null) throw e;
            })
    })
}