const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

let env = dotenv.parse(fs.readFileSync(path.join(__dirname, 'app.env')));
// stringify so that the it has the quotes around each var
Object.keys(env).forEach(key => env[key] = JSON.stringify(env[key]));


const config = {
    entry: "./app/App.jsx",
    output: {
        filename: "app.js",
        path: path.join(__dirname, "public", "bin")
    },

    resolve: {
        extensions: [".js", ".jsx", ".json"]
    },

    module: {
        rules: [
            { test: /\.jsx?$/, loader: "babel-loader", exclude: /node_modules/ }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': env
        })
    ]
}

module.exports = config;

