const { resolve } = require('path')
const webpackBaseConfig = require('./webpack.base.conf.js')
const merge = require('webpack-merge')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(webpackBaseConfig, {
  output: {
    filename: '[name][chunkhash].js'
  },
  /**
   * webpack 执行模式 详细文档 https://www.webpackjs.com/concepts/mode/
   */
  mode: 'production',
  /**
   * devtool 配置 source map，详细文档 https://www.webpackjs.com/configuration/devtool/#devtool
   * 不了解 source map的同学可以看看这篇文章[introduction-source-maps](https://blog.teamtreehouse.com/introduction-source-maps)或者[introduction-source-maps译文](https://github.com/xitu/gold-miner/blob/master/TODO1/introduction-source-maps.md)
   */
  devtool: 'hidden-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
   /*
    使用文件路径的 hash 作为 moduleId。
    虽然我们使用 [chunkhash] 作为 chunk 的输出名，但仍然不够。
    因为 chunk 内部的每个 module 都有一个 id，webpack 默认使用递增的数字作为 moduleId。
    如果引入了一个新文件或删掉一个文件，可能会导致其他文件的 moduleId 也发生改变，
    那么受影响的 module 所在的 chunk 的 [chunkhash] 就会发生改变，导致缓存失效。
    因此使用文件路径的 hash 作为 moduleId 来避免这个问题。
    */
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.HashedModuleIdsPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[contenthash].css",
      chunkFilename: "[contenthash].css"
    }),
  ],
  optimization: {
    /*
    上面提到 chunkFilename 指定了 chunk 打包输出的名字，那么文件名存在哪里了呢？
    它就存在引用它的文件中。这意味着一个 chunk 文件名发生改变，会导致引用这个 chunk 文件也发生改变。

    runtimeChunk 设置为 true, webpack 就会把 chunk 文件名全部存到一个单独的 chunk 中，
    这样更新一个文件只会影响到它所在的 chunk 和 runtimeChunk，避免了引用这个 chunk 的文件也发生改变。
    */
    runtimeChunk: true,
     /*
      默认 entry 的 chunk 不会被拆分
      因为我们使用了 html-webpack-plugin 来动态插入 <script> 标签，entry 被拆成多个 chunk 也能自动被插入到 html 中，
      所以我们可以配置成 all, 把 entry chunk 也拆分了
      */
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      /**
       * 这里使用UglifyJsPlugin 出现 Unexpected token punc «{», expected punc «)»，通过安装 uglifyjs-webpack-plugin@beta 才解决
       * 或者尝试webpack 默认的压缩包 terser-webpack-plugin
       */
      // new UglifyJsPlugin({
      //   cache: true,
      //   parallel: true,
      //   sourceMap: true // set to true if you want JS source maps
      // }),
      new TerserPlugin({
        sourceMap: true,
        cache: true,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  /**
   * 关闭生成环境的打包警告，因为打包的默认配置里边有一个推荐的大小250kb超过就会发警告信息，但开发环境因为包含了 sourcemap 并且代码未压缩所以一般都会超过这个大小，所以我们可以在开发环境把这个 warning 关闭。
   */
  performance: {
    hints: false
  }
})
