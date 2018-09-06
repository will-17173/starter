'use strict';

const Path = require('path');
const Webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MockjsWebpackPlugin = require("mockjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const entries = require('./entries').entries;
const htmlPlugins = require('./entries').htmlPlugins;

module.exports = (options) => {
    const dest = Path.join(__dirname, 'dist');

    let webpackConfig = {
        mode: options.mode,
        devtool: options.devtool,
        entry: entries,
        output: {
            path: dest,
            filename: 'js/[name].bundle.js'
        },
        optimization: {
            minimizer: options.isProduction ? [
                new UglifyJsPlugin({
                    sourceMap: false,
                    uglifyOptions: {
                        ie8: true,
                        warnings: false,
                        output: {
                            keep_quoted_props: true,
                            comments: false,
                            beautify: false,
                            ascii_only: true,
                            quote_keys: true
                        },
                        compress: {
                            properties: false
                        }
                    },
                }),
                new OptimizeCSSAssetsPlugin({})
            ] : [],

            minimize: options.isProduction ? true : false,
            splitChunks: options.isProduction ? {
                chunks: "all",
                minSize: 0,
                minChunks: 2,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                name: 'vendor',
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            } : {}
        },
        module: {
            rules: [{
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015']
                        }
                    }
                },
                {
                    test: /\.handlebars$/,
                    loader: "handlebars-loader"
                },
                {
                    test: /\.(gif|png|jpe?g|svg)$/i,
                    use: [{
                            loader: 'url-loader',
                            options: {
                                limit: 8000, // Convert images < 8kb to base64 strings
                                name: 'img/[hash:8].[ext]'
                            }
                        },
                        // {
                        //     loader: 'file-loader',
                        //     options: {
                        //         name: 'img/[name].[ext]'
                        //     }
                        // },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                disable: true
                            }
                        },
                    ],
                }

            ]
        },
        plugins: [
            new Webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(options.isProduction ? 'production' : 'development')
                }
            }),
            new MiniCssExtractPlugin({
                filename: "css/[name].css",
                chunkFilename: "css/[id].css"
            }),
            new CleanWebpackPlugin([dest])
        ]
    };

    webpackConfig.plugins = webpackConfig.plugins.concat(htmlPlugins);

    if (options.isProduction) {
        webpackConfig.module.rules.push({
            test: /\.(sa|sc|c)ss$/,
            use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '../'
                    }
                },
                {
                    loader: 'css-loader',
                },
                'sass-loader'
            ]
        })

        webpackConfig.plugins.push(
            new TransferWebpackPlugin([
                { from: 'assets', to: '' }
            ])
        )

    } else {
        webpackConfig.module.rules.push({
            test: /\.(sa|sc|c)ss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        })
        webpackConfig.plugins.push(
            new Webpack.HotModuleReplacementPlugin()
        );
        webpackConfig.plugins.push(
            new MockjsWebpackPlugin({
                path: Path.join(__dirname, "./mock"),
                port: 8888
            })
        )
        webpackConfig.devServer = {
            disableHostCheck: true,
            contentBase: [dest, Path.join(__dirname, "assets")],
            // hot: true,
            port: options.port,
            inline: true,
            proxy: {
                "/api": "http://localhost:8888/"
            }
        };
    }

    return webpackConfig;

};