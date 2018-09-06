const HtmlWebpackPlugin = require('html-webpack-plugin');

var path = require('path');
var fs = require('fs');
let entries = {};
let pages = [];
let htmlPlugins = [];

function eachEntryFiles(dir) {
    try {
        fs.readdirSync(dir).forEach(file => {
            if (/(entry\.js)$/.test(file)) {
                var filePath = dir + '/' + file;
                var fname = path.basename(file, '.entry.js');
                entries[fname] = filePath;
            }

        })
    } catch (e) {

    }
}

function eachHtmlFiles(dir) {
    try {
        fs.readdirSync(dir).forEach(file => {
            /*
             * {
             *   index:'./src/index.html',
             *   chunkname:'index'
             * }
             * */
            var fileObj = {};
            var filePath = dir + '/' + file;
            var fullname = path.join(dir, file);
            var stats = fs.statSync(fullname);
            if (stats.isDirectory()) {
                return;
            }
            var chuckName = path.basename(file, '.html');
            fileObj['filename'] = file;
            fileObj['template'] = filePath;
            fileObj['chuckName'] = chuckName;
            pages.push(fileObj)
        })

        pages.forEach(page => {
            htmlPlugins.push(
                new HtmlWebpackPlugin({
                    template: page.template,
                    filename: page.filename,
                    chunks: ['vendor', page.chuckName]
                })
            )
        })

    } catch (e) {

    }
}

eachEntryFiles('./src/js');
eachHtmlFiles('./src')
module.exports = {
    entries,
    htmlPlugins
}