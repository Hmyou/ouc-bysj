// Learn more on how to config.
// - https://github.com/ant-tool/atool-build#配置扩展

const webpack = require('atool-build/lib/webpack');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const  SftpWebpackPlugin = require('sftp-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = function (webpackConfig) {
  webpackConfig.babel.plugins.push('transform-runtime');
  webpackConfig.babel.plugins.push(['antd', {
    style: 'css',  // if true, use less
  }]);

  // Enable this if you have to support IE8.
  // webpackConfig.module.loaders.unshift({
  //   test: /\.jsx?$/,
  //   loader: 'es3ify-loader',
  // });

  // Parse all less files as css module.
  webpackConfig.module.loaders.forEach(function(loader, index) {
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
      loader.test = /\.dont\.exist\.file/;
    }
    if (loader.test.toString() === '/\\.module\\.less$/') {
      loader.test = /\.less$/;
      loader.loader= ExtractTextPlugin.extract("style-loader", "css-loader!less-loader");
    }
  });

  // Load src/entries/*.js as entry automatically.
  const files = glob.sync('./src/entries/*.js');
  const newEntries = files.reduce(function(memo, file) {
    const name = path.basename(file, '.js');
    memo[name] = file;
    return memo;
  }, {});



  webpackConfig.entry = Object.assign({}, webpackConfig.entry, newEntries);

  //设置sftp
  //webpackConfig.plugins.push(new SftpWebpackPlugin({
  //  port: '36000',
  //  host: '10.1.136.50',
  //  username: 'root',
  //  password: 'admin@dev',
  //  from: ['./dist/'],
  //  to: '/usr/local/tads/htdocs/iwanaddev/src/web/main/'
  //}));

  webpackConfig.devtool='#source-map';


  return webpackConfig;
};
