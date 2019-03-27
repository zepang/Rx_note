# 项目记录

# 启动项目
1. 创建项目更目录
```
mkdir Hands-OnFull-StackWebDevelopmentWithGraphQLandReact
cd Hands-OnFull-StackWebDevelopmentWithGraphQLandReact
npm init -y
```
2. 配置eslint
下边的命令，需要全局安装一下eslint的包
```
eslint --init
```
选择 `react` 和 `standard`，最后会在根目录下面生成`.eslintrc.js`文件

```js
module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: 'standard',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['react']
  rules: {}
}
```

**补充**

后面发现`plugins:['react']`好像没有生效，删除这个配置，`extends`添加下边的配置
```js
module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ['standard', 'plugin:react/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {}
}

```

3. 开发环境webpack配置
```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/client/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [path.resolve('node_modules')],
        include: [path.resolve('src')],
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  devServer: {
    port: 3000
  }
}

```

以项目能跑起来为最低要求配置的的webpack，非常的简单，可以参考webpack的配置文档。

4. 配置基本的命令和安装包
然后在`package.json`中配置`webpack-dev-server`的命令

```json
{
  "script": {
    "client": "webpack-dev-server --hot --progress --config webpack.client.config.js"
  }
}
```

之后我们就可以直接使用`npm run client`命令来启动开发模式

在这之前，我们还有一个需要配置--babel。我们在webpack中使用了`babel-loader`，`babel-loader`会去读取根目录的 `babel.config.js`或者`.babelrc`文件。

```js
module.exports = {
  preset: ['env', 'react']
}
```
这里也不做多余的配置，直接使用babel提供的preset：
  * `env` 用于支持我们使用最新的`JavaScript`语法
  * `react` 主要就是为了支持jsx语法。我们也可以只安装一个`@babel/plugin-transform-react-jsx`插件，这样我们的项目也可以跑起来。

到这一步我们先把上边配置需要的包安装一下：

  ```
  npm install --save-dev eslint-loader babel-loader @babel/core @babel/preset-env @babel/preset-react

  npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin

  npm install --save react react-dom
  ```

根据webpack配置创建入口文件和index.html文件

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div class="" id="root"></div>
</body>
</html>
```

```js
// src/client/index.js
import React from 'react'
import ReactDom from 'react-dom'
import App from './App'

ReactDom.render(<App />, document.getElementById('root'))
```
根目录下启动终端，输入：
```
npm run client
```
到这一步应该是完全的可以跑起项目的。

# 