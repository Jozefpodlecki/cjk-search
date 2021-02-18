delete process.env.TS_NODE_PROJECT;

import { resolve } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import DotenvPlugin from "webpack-dotenv-plugin";
import { Configuration } from "webpack";

const CopyWebpackPlugin = require("copy-webpack-plugin");

const config: Configuration = {
    entry: {
        app: "./src/client/index.tsx",
    },
    output: {
        path: resolve(__dirname, "public"),
        publicPath: "/",
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".json", ".scss", ".wasm", ".js", "png", "svg", "jpg", "gif", "webm", "mp3"],
        plugins: [
            new TsconfigPathsPlugin({
                baseUrl: "src/client",
                configFile: "./tsconfig-client.json",
            }) as any,
        ]
    },
    module: {
        rules: [
            {
                test: /worker\.js$/,
                use: { 
                    loader: "worker-loader"
                },
            },
            {
                test: /hanzi_lookup\.js$/,
                use: { 
                    loader: "file-loader",
                    options: {
                        name: "[path][name].[ext]",
                    }
                },
            },
            {
                test: /\.ts(x?)$/,
                loader: "ts-loader",
                options: {
                    configFile: "tsconfig-client.json"
                }
            },
            {
                test: /\.(png|jpe?g|gif|wasm|webm|mp3)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[path][name].[ext]",
                        }
                    },
                ],
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin ({
            patterns: [
                {
                    from: "src/hanzi_lookup.js",
                    to: ".",
                }
            ]
        }),
        new HtmlWebpackPlugin({
            // favicon: resolve(__dirname, "src/assets/images/favicon.ico"),
            template: "src/client/index.html",
        }),
        new DotenvPlugin({
            sample: ".env",
            path: "./.env"
        }) as any,
    ]
};

export default config;