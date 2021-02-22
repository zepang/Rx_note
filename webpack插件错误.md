# mini-css-extract-plugin Conflicting order 警告解决

1. 忽略警告

```js
// vue.config.js
plugins: [
  new MiniCssExtractPlugin({
    // ......
    ignoreOrder: true
  }),
],
```

2. 更高对应文件的引入顺序

# Cannot read property '__expression' of undefined 

vue.config.js webpack-chain配置插件导致的问题，可能是插件不存在

