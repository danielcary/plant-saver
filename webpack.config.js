var path = require('path');

const config = {
    entry: "./app/App.tsx",
    output: {
        filename: "app.js",
        path: path.join(__dirname, "public", "bin")
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: ["babel-loader", "awesome-typescript-loader"] }
        ]
    }
}

module.exports = config;

