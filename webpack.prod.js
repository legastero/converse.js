/* global __dirname, module, process */
const common = require("./webpack.common.js");
const merge = require("webpack-merge");
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ASSET_PATH = process.env.ASSET_PATH || '/dist/'; // eslint-disable-line no-process-env

module.exports = merge(common, {
    output: {
        publicPath: ASSET_PATH,
        filename: 'converse.min.js',
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false // resolves conflict with CopyWebpackPlugin
        }),
        new MiniCssExtractPlugin({filename: '../dist/converse.min.css'}),
        new CopyWebpackPlugin([
            {from: 'sounds'},
            {from: 'images/favicon.ico'},
            {from: 'images/custom_emojis', to: 'custom_emojis'},
            {from: 'sass/webfonts', to: 'webfonts'}
        ]),
        new webpack.DefinePlugin({ // This makes it possible for us to safely use env vars on our code
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
        })
    ],
    mode: "production",
    devtool: "source-map",
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        url: false,
                        sourceMap: true

                    }
                },
                'postcss-loader',
                {
                    loader: 'sass-loader',
                    options: {
                        includePaths: [
                            path.resolve(__dirname, 'node_modules/')
                        ],
                        sourceMap: true
                    }
                }
            ]
        }]
    }
});

