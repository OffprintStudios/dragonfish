const path = require("path");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

console.log(`Exporting this webpack config, for word counter: ${path.resolve(__dirname, '..', '..', 'native', 'word_counter', 'src')}`);
module.exports = (config, context) => {
    return {
        ...config,        
        plugins: [
            ...config.plugins,
            new WasmPackPlugin({
                crateDirectory: path.resolve(__dirname, "..", "..", "native", "word_counter", "src"),                
                extraArgs: "--target bundler",
                outDir: path.resolve(__dirname, "..", "..", "packages", "word_counter", "src", "lib"),
                outName: "word_counter",
                // Release should probably be in a separate webpack.config.prod.js or something. But for now...
                forceMode: "release"
            }),
            new WasmPackPlugin({
                crateDirectory: path.resolve(__dirname, "..", "..", "native", "html_sanitizer", "src"),                
                extraArgs: "--target bundler",
                outDir: path.resolve(__dirname, "..", "..", "packages", "html_sanitizer", "src", "lib"),
                outName: "html_sanitizer",
                // Release should probably be in a separate webpack.config.prod.js or something. But for now...
                forceMode: "release"
            })
        ]
    }
}