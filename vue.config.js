require('dotenv').config();
const backendCfg = require('./backend/config/config');

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    configureWebpack: config => {
        config.entry = {
            app: path.join(__dirname, 'frontend', 'src', 'main.js')
        };
        config.resolve = {
            ...config.resolve,
            alias: {
                '@': path.join(__dirname, 'frontend', 'src'),
                vue$: 'vue/dist/vue.runtime.esm.js'
            },
            extensions: [
                '.wasm',
                '.mjs',
                '.js',
                '.jsx',
                '.vue',
                '.json'
            ],
            modules: [
                path.resolve(__dirname, './node_modules'),
            ]
        };
        config.plugins = [
            ...config.plugins,
            new HtmlWebpackPlugin({
                filename: 'index.html',
                favicon:  path.resolve(__dirname, './frontend/favicon.ico'),
                template: path.resolve(__dirname, './frontend/index.html'),
                title: 'FETCHER',
                inject: true
            }),
            new CopyWebpackPlugin([ // copy static to dist folder
                { from: path.resolve(__dirname, 'frontend/src/assets/img'), to: 'assets/img' }, // copy img folder content to /dist/assets/img
            ]),
        ];
        config.devServer = {
            ...config.devServer,
            proxy: {
                '/': {
                    target: `http://localhost:${backendCfg.app.port}`
                },
            },
            port: process.env.PORT || 8080
        };
    }
};
