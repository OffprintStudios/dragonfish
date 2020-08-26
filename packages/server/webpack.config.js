const path = require("path");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

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
            })
        ]
    }
}