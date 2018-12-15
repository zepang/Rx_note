# 什么是 babel?

## babel 是 JavaScript 编译器

# babal 的作用？

1. 转换语法
2. Polyfill 实现目标环境中缺少的功能（通过 [@babel-polyfill](https://babeljs.io/docs/en/babel-polyfill)）
3. 源代码转换
4. ...

> 有关编译器的精彩教程，请查看 the-super-tiny-compiler，它还解释了 Babel 本身如何在高级语言上工作。

JSX 和 React 

babel 可以转换 JSX 语法！点击查看 [React preset](https://babeljs.io/docs/en/babel-preset-react) 开始使用

# babel 使用指南

Babel 的核心功能在 [@babel/core](https://babel.docschina.org/docs/en/babel-core) 模块，无论是以何种方式使用 babel，@babel/core 也是必不可少。

[@babel/cli](https://babel.docschina.org/docs/en/babel-cli) 是一个允许你从终端使用 babel 的工具。

## Plugins && Presets

代码转换以插件的形式出现，插件是小型 JavaScript 程序，它指示 Babel 如何对代码进行转换。你甚至可以编写自己的插件来应用你想要的任何代码转换。要将ES2015+ 语法转换为 ES5，我们可以依赖官方插件，如 @babel/plugin-transform-arrow-functions:
~~~
npm install --save-dev @babel/plugin-transform-arrow-functions

./node_modules/.bin/babel src --out-dir lib --plugins=@babel/plugin-transform-arrow-functions
~~~
通常我们不会一步一步去添加我们想要的插件，而是通过设置预设来实现指定一组插件。

## 配置

> 据你的需要，可以使用几种不同的方法配置文件。请务必阅读有关如何 [配置 Babel](https://babeljs.io/docs/en/configuration) 的深入指南以获取更多信息

@babel/polyfill 包括



