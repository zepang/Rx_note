# 旧版vue-cli项目webpack升级记录

发现的问题：老的项目构建使用的vue-cli脚手架使用的是之前旧的vue-template模板项目，目前这份模板应该是没有人去维护了。项目中的webpack的版本使用的3以上的版本，无论是构建速度还是配置方面都没有webpack4的版本做的好，而且webpack4版本发布的时间也不短，稳定性方面肯定是没有问题的。所以想给之前的老项目做个升级。

我们先更新webpack的版本

      yarn upgrade webpack@4.27.1 -D

webpack4还需要依赖webpack-cli

      yarn add webpack-cli -D

顺便把 webpack-dev-server也更新吧(因为发现webpack-dev-server没有3.0以上，后面安装的babel-core babel-preset-env 的时候报错)

      yarn add webpack-dev-server -D

另外需要将所有的loader进行更新

      yarn add -D vue-loader vue-style-loader css-loader file-loader url-loader postcss-loader eslint-loader 

我们将babel7x升级到babel8x也进行更新

      yarn add babel-loader @babel/core @babel/preset-env -D

将不需要的包移除

      yarn remove babel-core babel-preset-env -D

进行配置的更改，找到build/webpack.base.conf.js，添加下面配置

~~~js
const { VueLoaderPlugin } = require('vue-loader')
plugins: [
  new VueLoaderPlugin(),
]
~~~

接下来先直接使用npm run dev

发现报错
~~~
10% building 1/1 modules 0 active(node:1617) DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead                                                        94% after seal
 ERROR  Failed to compile with 1 errors                                                                                                                                                                         15:53:31
Module build failed (from ./node_modules/babel-loader/lib/index.js):
TypeError: this.setDynamic is not a function
    at PluginPass.pre (/mnt/e/work/agent-page/node_modules/babel-plugin-transform-runtime/lib/index.js:31:12)
    at transformFile (/mnt/e/work/agent-page/node_modules/@babel/core/lib/transformation/index.js:78:27)
    at runSync (/mnt/e/work/agent-page/node_modules/@babel/core/lib/transformation/index.js:45:3)
    at transformSync (/mnt/e/work/agent-page/node_modules/@babel/core/lib/transform.js:43:38)
    at Object.transform (/mnt/e/work/agent-page/node_modules/@babel/core/lib/transform.js:22:38)
    at transpile (/mnt/e/work/agent-page/node_modules/babel-loader/lib/index.js:55:20)
    at Object.module.exports (/mnt/e/work/agent-page/node_modules/babel-loader/lib/index.js:179:20)
~~~

我们安装一下 
~~~js
yarn add @babel/runtime @babel/plugin-transform-runtime -D
~~~
并修改.babelrc
~~~js
"plugins": ["transform-vue-jsx", "@babel/plugin-transform-runtime"],
~~~

npm run dev

又发现报错

~~~
Syntax Error: SyntaxError: /mnt/e/work/agent-page/src/router/index.js: Support for the experimental syntax 'dynamicImport' isn't currently enabled (18:21):

  16 | // import Uri from 'src/app/subuser/route'
  17 |
> 18 | const Login = () => import('src/app/login/login')
     |                     ^
  19 | const Forget = () => import('src/app/password/forget')
  20 | const Modify = () => import('src/app/password/modify')
  21 | const Home = () => import('src/app/home/home')

Add @babel/plugin-syntax-dynamic-import (https://git.io/vb4Sv) to the 'plugins' section of your Babel config to enable parsing.


 @ ./src/main.js 3:0-34 21:10-16
 @ multi (webpack)-dev-server/client?http://0.0.0.0:8080 (webpack)/hot/dev-server.js ./src/main.js
~~~

接着安装

~~~
yarn add @babel/plugin-syntax-dynamic-import -D
~~~





