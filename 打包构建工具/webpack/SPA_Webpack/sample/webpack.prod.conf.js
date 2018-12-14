const { resolve } = require('path')
const webpackBaseConfig = require('./webpack.base.conf.js')
const merge = require('webpack-merge')

module.exports = merge(webpackBaseConfig, {
  /**
   * webpack 执行模式 详细文档 https://www.webpackjs.com/concepts/mode/
   */
  mode: 'production',
  /**
   * devtool 配置 source map，详细文档 https://www.webpackjs.com/configuration/devtool/#devtool
   * 不了解 source map的同学可以看看这篇文章[introduction-source-maps](https://blog.teamtreehouse.com/introduction-source-maps)或者[introduction-source-maps译文](https://github.com/xitu/gold-miner/blob/master/TODO1/introduction-source-maps.md)
   */
  devtool: 'hidden-source-map'
})
