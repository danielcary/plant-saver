const webpack = require('webpack'); 
const path = require('path');
const dotenv = require('dotenv');

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
            'process.env': dotenv.parse(path.join(__dirname, '.env'))
        })
    ]
}

module.exports = config;

