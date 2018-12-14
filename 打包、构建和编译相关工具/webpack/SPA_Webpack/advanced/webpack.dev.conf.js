const { resolve } = require('path')
const webpackBaseConfig = require('./webpack.base.conf.js')
const merge = require('webpack-merge')

module.exports = merge(webpackBaseConfig, {
  /**
   * webpack 执行模式 详细文档 https://www.webpackjs.com/concepts/mode/
   */
  mode: 'development',
  /**
   * devtool 配置 source map，详细文档 https://www.webpackjs.com/configuration/devtool/#devtool
   * 不了解 source map的同学可以看看这篇文章[introduction-source-maps](https://blog.teamtreehouse.com/introduction-source-maps)或者[introduction-source-maps译文](https://github.com/xitu/gold-miner/blob/master/TODO1/introduction-source-maps.md)
   */
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        // 匹配 css 文件
        test: /\.css$/,

        /*
        先使用 css-loader 处理，返回的结果交给 style-loader 处理。
        css-loader 将 css 内容存为 js 字符串，并且会把 background, @font-face 等引用的图片，
        字体文件交给指定的 loader 打包，类似上面的 html-loader, 用什么 loader 同样在 loaders 对象中定义，等会下面就会看到。
        添加 postcss-loader 并且在根目录下建立.postcssrc.js文件，引入相关的插件和配置
        */
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    compress: true,
    // hot: true,
    noInfo: true
  }
})