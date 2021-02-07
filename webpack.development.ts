import { resolve } from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import common from "./webpack.common"

const environment = "development";
process.env.NODE_ENV = environment;

const config: Configuration = merge(common, {
    mode: environment,
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /styles\.scss$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                indentWidth: 4,
                                includePaths: [resolve(__dirname, "src/styles")],
                            },
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                exclude: /styles\.scss$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            sourceMap: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                indentWidth: 4,
                                includePaths: [resolve(__dirname, "src/styles")],
                            },
                        }
                    },
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
    ]
});

export default config;