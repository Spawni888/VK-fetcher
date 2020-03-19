const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    configureWebpack: config => {
        config.entry = {
            app: path.join(__dirname, 'src', 'main.js')
        };
        config.resolve = {
            ...config.resolve,
            alias: {
                '@': path.join(__dirname, 'src'),
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
                favicon:  path.resolve(__dirname, './public/favicon.ico'),
                template: path.resolve(__dirname, './public/index.html'),
                title: 'FETCHER',
                inject: true
            })
        ];
    }
};
