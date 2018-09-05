module.exports = require('./webpack.config.common')({
    isProduction: true,
    devtool: 'source-map',
    mode: 'production',
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
    }
});