const path = require("path");
const webpack = require("webpack");

module.exports = {
    baseUrl: process.env.NODE_ENV == "production" ? "/" : "/",
    transpileDependencies: [/\bresize-detector\b/],
    lintOnSave: false, // ture | false | 'error'
    devServer: {
        open: process.platform === "darwin",
        host: "127.0.0.1",
        port: 8088,
        https: false,
        hotOnly: false
        // ,proxy: {
        //     "/api": {
        //         target: "", //Blockcloud JSON-RPC host
        //         changeOrigin: false,
        //         pathRewrite: {
        //             "^/api": ""
        //         }
        //     }
        // }
    },

    configureWebpack: {
        resolve: {
            alias: {
                Api: path.resolve(__dirname, "src/api/"),
                Components: path.resolve(__dirname, "src/components/"),
                Constants: path.resolve(__dirname, "src/constants/"),
                Container: path.resolve(__dirname, "src/container/"),
                Views: path.resolve(__dirname, "src/views/"),
                Helpers: path.resolve(__dirname, "src/helpers/"),
                Themes: path.resolve(__dirname, "src/themes/")
            },
            extensions: ["*", ".js", ".vue", ".json"]
        },
        plugins: [
            //jquery plugin
            new webpack.ProvidePlugin({
                $: "jquery",
                jquery: "jquery",
                "window.jQuery": "jquery",
                jQuery: "jquery"
            })
        ]
    }
};
