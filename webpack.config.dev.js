module.exports = require('./webpack.config.common')({
    isProduction: false,
    devtool: 'cheap-eval-source-map',
    port: 3333,
    mode: 'development'
});