const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require('dotenv-webpack');

const isEnvProduction = process.env.NODE_ENV === "production";

module.exports = {
    mode: isEnvProduction ? "production" : "development",
    devtool: "source-map",
    entry: {
        index: "./src/ui/index.jsx",
        code: "./src/sandbox/code.js"
    },
    experiments: {
        outputModule: true
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        module: true,
        filename: "[name].js"
    },
    externalsType: "module",
    externalsPresets: { web: true },
    externals: {
        "add-on-sdk-document-sandbox": "add-on-sdk-document-sandbox",
        "express-document-sdk": "express-document-sdk"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
            scriptLoading: "module",
            excludeChunks: ["code"]
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: "src/*.json", to: "[name][ext]" }]
        }),
        new Dotenv()
    ],
    module: {
        rules: [
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                use: 'file-loader?name=fonts/[name].[ext]!static'
               },
            {
                test: /\.(js|jsx)$/,
                use: ["babel-loader"],
                exclude: /node_modules/
            },
            {
                test: /(\.css)$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      query: {
                        name:'assets/[name].[ext]'
                      }
                    }
                  },
                  {
                    loader: 'image-webpack-loader',
                    options: {
                      query: {
                        mozjpeg: {
                          progressive: true,
                        },
                        gifsicle: {
                          interlaced: true,
                        },
                        optipng: {
                          optimizationLevel: 7,
                        }
                      }
                    }
                  }]
              }
        ]
    },
    resolve: {
        extensions: [".jsx", ".js", ".css"]
    }
};