# 旧版 vue-cli 项目 webpack 升级记录

发现的问题：老的项目构建使用的 vue-cli 脚手架使用的是之前旧的 vue-template 模板项目，目前这份模板应该是没有人去维护了。项目中的 webpack 的版本使用的 3 以上的版本，无论是构建速度还是配置方面都没有 webpack4 的版本做的好，而且 webpack4 版本发布的时间也不短，稳定性方面肯定是没有问题的。所以想给之前的老项目做个升级。

我们先查看一下具体的包的版本，先确定哪些包是一定要更新的，哪些包是可以不用更新的，比如 babel 之类的包，这里用的 balbel-loader7 和 babel6 这些与 babel 相关的包就可以不用更新。接下来我们一步一步来，
首先升级 webpack 包到 4 版本，由于使用了 webpack4x 版本，所以还需要 webpack-cli

```
yarn remove webapck -D
yarn add webpack webpack-cli -D
```

yarn 给我们安装了最新的 webpack@4.27.1。webpack 版本更新，会导致其他的包不兼容和一些老的配置不可用，所以我们一步一步来找不兼容的包和更新老配置。

接下来，我们先改开发环境下的配置

```
yarn run dev
```

发现报了下面的错误

```
Error: Cannot find module 'webpack/bin/config-yargs'
```

我猜测应该是是 webpack 更新了之后已经没有这个文件了，我们在项目中搜索'webpack/bin/config-yargs'，发现了是 webpack-dev-server 引用了这个文件，目前的 webpack-dev-server 是@2.9.1。我们试着将 webpack-dev-server 升级一下

```
yarn remove webpack-dev-server
yarn add webpack-dev-server -D
```

```json
"webpack-dev-server": "^3.1.10"
```

再次 yarn run dev

```
(node:208) DeprecationWarning: Tapable.apply is deprecated. Call apply on the plugin directly instead                                                                                  11% building 11/17 modules 6 active ...e/node_modules/loglevel/lib/loglevel.js/mnt/e/work/agent-page/node_modules/html-webpack-plugin/lib/compiler.js:81
        var outputName = compilation.mainTemplate.applyPluginsWaterfall('asset-path', outputOptions.filename, {
                                                  ^

TypeError: compilation.mainTemplate.applyPluginsWaterfall is not a function
```

有了上边 webpack-dev-server 的类似情况，我们也将 html-webpack-plugin 升级到最新的版本，再次 yarn run dev 发现不在出现刚才的问题，应该就是版本不兼容。接下来我们把一个个出现问题的包都先进行升级。

- eslint-loader

```
Module build failed (from ./node_modules/eslint-loader/index.js):
TypeError: Cannot read property 'eslint' of undefined
```

- vue-loader

```
Module build failed (from ./node_modules/vue-loader/index.js):
TypeError: Cannot read property 'vue' of undefined
    at Object.module.exports (/mnt/e/work/agent-page/node_modules/vue-loader/lib/loader.js:61:18)
```

这里需要注意 vue-loader 升级到 15x 之后配置和之前的有些不一样，具体的修改去看官方文档。我们这里先不改，先选择升级有问题的包。

```
Module parse failed: Unexpected character '@' (199:0)
You may need an appropriate loader to handle this file type.
|
|
> @value styles: '../../common/css/variables.css';
|
| @value white, black, grey from styles;
```

这里报错是因为我们在单文件的 css 写法是 cssModule 的写法，之前是在 vue-loader 的 options 进行配置，现在由于 vue-loader 升级了，之前的配置恐怕无效了。

通过查询官方文档，我们将webpack.dev.conf.js做如下修改：

```js
module: {
    rules: [
      {
        test: /\.css$/,
        oneOf: [
          // 这里匹配 `<style module>`
          {
            resourceQuery: /module/,
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[path][name]---[local]---[hash:base64:5]'
                }
              }
            ]
          },
          // 这里匹配普通的 `<style>` 或 `<style scoped>`
          {
            use: [
              'vue-style-loader',
              'css-loader'
            ]
          }
        ]
      },
    ]
    // rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
```

我们顺便将 css-loader 和 vue-style-loader进行一个升级

vue-loader
```
Module Error (from ./node_modules/vue-loader/lib/index.js):
vue-loader was used without the corresponding plugin. Make sure to include VueLoaderPlugin in your webpack config.
```
这个报错就是之前我说的vue-loader的配置问题，我们按照文档上的说明更改配置。

~~~js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  // ...
  plugins: [
    new VueLoaderPlugin()
  ]
}
~~~~

接下来再次 yarn run dev 就应该没问题了。

下面是npm run build 的报错：

~~~
Error: webpack.optimize.CommonsChunkPlugin has been removed, please use config.optimization.splitChunks instead.
~~~
移除optimize.CommonsChunkPlugin的相关配置，以为webpack4x已经不用这个配置了。
~~~
Error: Chunk.entrypoints: Use Chunks.groupsIterable and filter by instanceof Entrypoint instead
    at Chunk.get (/mnt/e/work/agent-page/node_modules/webpack/lib/Chunk.js:849:9)
    at /mnt/e/work/agent-page/node_modules/extract-text-webpack-plugin/dist/index.js:176:48
    at Array.forEach (<anonymous>)
    at /mnt/e/work/agent-page/node_modules/extract-text-webpack-plugin/dist/index.js:171:18
    at AsyncSeriesHook.eval [as callAsync] (eval at create (/mnt/e/work/agent-page/node_modules/tapable/lib/HookCodeFactory.js:32:10), <anonymous>:7:1)
    at AsyncSeriesHook.lazyCompileHook (/mnt/e/work/agent-page/node_modules/tapable/lib/Hook.js:154:20)
    at Compilation.seal (/mnt/e/work/agent-page/node_modules/webpack/lib/Compilation.js:1242:27)
    at hooks.make.callAsync.err (/mnt/e/work/agent-page/node_modules/webpack/lib/Compiler.js:546:17)
    at _done (eval at create (/mnt/e/work/agent-page/node_modules/tapable/lib/HookCodeFactory.js:32:10), <anonymous>:9:1)
    at _err1 (eval at create (/mnt/e/work/agent-page/node_modules/tapable/lib/HookCodeFactory.js:32:10), <anonymous>:32:22)
    at _addModuleChain (/mnt/e/work/agent-page/node_modules/webpack/lib/Compilation.js:1093:12)
    at processModuleDependencies.err (/mnt/e/work/agent-page/node_modules/webpack/lib/Compilation.js:1005:9)
    at _combinedTickCallback (internal/process/next_tick.js:132:7)
    at process._tickCallback (internal/process/next_tick.js:181:9)
~~~
extract-text-webpack-plugin还不能支持webpack4.0.0以上的版本，需要使用 mini-css-extract-plugin。





