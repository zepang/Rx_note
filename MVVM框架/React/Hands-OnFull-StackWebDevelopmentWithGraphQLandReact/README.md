# 项目记录

# 启动项目

这块分为两部分，前端react项目，后端express项目，我们先做前端这一部分：
## 前端项目启动
1. 创建项目跟目录
```
mkdir Hands-OnFull-StackWebDevelopmentWithGraphQLandReact
cd Hands-OnFull-StackWebDevelopmentWithGraphQLandReact
npm init -y
```

前端的代码主要在 `/src/client/`
后端的代码主要在 `/src/server/`

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

在这之前，我们还有一个需要配置--babel。我们在webpack中使用了`babel-loader`，`babel-loader`会去读取根目录的 `babel.config.js`或者`.babelrc`文件，我们创建包含如下配置的`.babelrc`文件

```json
{
  "presets": ["@babel/env", "@babel/react"]
}

```
这里也不做多余的配置，直接使用babel提供的preset：
  * `env` 用于支持我们使用最新的`JavaScript`语法
  * `react` 主要就是为了支持jsx语法。我们也可以只安装一个`@babel/plugin-transform-react-jsx`插件，这样我们的项目也可以跑起来。

到这一步我们先把上边配置需要的包安装一下：

  ```
  npm install --save-dev eslint-loader babel-loader @babel/core @babel/preset-env @babel/preset-react

  npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin

  npm install --save-dev css-loader style-loader

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

5. 配置打包分析

```
npm install --save-dev webpack-bundle-analyzer
```

在package.json中配置下边的命令

```json
{
  ...
  "script": {
    "stats": "webpack --profile --json --config webpack.client.build.config.js > stats.json",
    "analyze": "webpack-bundle-analyzer stats.json"
  }
}
```



## 后端项目启动

1. 安装express和启动服务

```
npm install --save express
```

创建`/src/server/index.js`, 填入下边的代码

```js
const express = require('express')

const app = express()

app.get('*', (req, res) => {
  res.send('hello world!')
})

app.listen(8000, () => {
  console.log('Listening on port 8000')
})
```

node本身已经支持很多新的es语法，考虑周全一点，我们还是需要使用到`babel-node`。另外我们选择使用 nodemon 来启动server

```
npm install --save nodemon 
npm install --save-dev @babel/node
```

在package中加入下面的命令：
```json
{
  "script": {
    "server": "nodemon --exec babel-node --watch src/server src/server/index.js"
  }
}
```

在使用babel-node的情况下，我们可以使用 import 来引入 express，当然node在9之后的版本也是支持import的
```js
import express from 'express'
```

2. 配置express的静态资源

实际上我们的express主要用于接口服务，静态资源目录有无都无所谓，我们这里将一些client端的资源配进行重定向，以便在当前服务下可访问

```js
import path from 'path'
const root = path.join(__dirname, '../../')

app.use('/', express.static(root, 'dist/client))
app.use('/uploads', express.static(root, 'uploads'))
app.get('/', () => {
  res.sendFile(path.join(root, 'dist/client/index.html'))
})
```


# 前端相关的包

* react-helmet

*This reusable React component will manage all of your changes to the document head.*

比如用来改变HTML的title和description

```
npm install --save react-helmet
```

# 服务端相关的包

* Express Helmet

*Helmet helps you secure your Express apps by setting various HTTP headers.*

Helmet is a collection of 14 smaller middleware functions that set HTTP response headers.See more on github repo[https://github.com/helmetjs/helmet](https://github.com/helmetjs/helmet)

我们在使用 `Helmet` 的时候尽量把它置于其他中间件的上方，``Helmet`会默认给我开启一些安全防护，这些清查看上边的文档。

* cors
* compress

# 可能会涉及的一些问题

## Define state with property initializers inside our class

#### scene

通常的一种写法是这样的，官方文档上的写法也是这样的。

```js
import {component} from 'react'
const App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ...
    }
  }
}
```

如果你要这样写，也就是直接在类中初始化 state

```js
import {component} from 'react'
const App extends Component {
  state = {
    ...
  }
}
```

#### solution

项目里边一般有两个地方需要做修改：

* eslint 的语法检验

```js
module.exports = {
  ...
  parser: 'babel-eslint',
  ...
}
```

```
npm install --save-dev babel-eslint
```

*babel-eslint allows you to lint ALL valid Babel code with the fantastic ESLint.*

eslint本身只支持标准的语法，但是babel-eslint可以使得eslint支持所有babel中合法的特性。

* babel 的转换

```json
{
  "presets": ["@babel/env", "@babel/react"],
  "plugins": [
   "@babel/plugin-proposal-class-properties"
  ]
}
```

```
npm install --save-dev @babel/plugin-proposal-class-properties
```

为了能够转换 property initializers 这种写法，需要给babel添加 `@babel/plugin-proposal-class-properties` 这个插件
