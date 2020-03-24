
# 为什么需要Babel？

Babel是一个工具链，主要用于将ECSMScript 2015+ 版本的代码转换为向后兼容的JavaScript语法，以便能够运行在当前和旧版的浏览器或者其他环境中。

# Babel能做什么？

- 语法转换

- 通过polyfill方式在目标环境中添加缺失的特性（@babel/polyfill模块）

- 源码转换

# 使用babel必须要搞清楚的一些内容：

- @babel/core

包含babel核心功能的模块，没有`@babel/core`，babel就无法进行编译。

- @babel/cli

主要是提供`babel`这个命令，适合安装在项目里边。另外`@babel/node`提供了`babel-node`命令，但是`@babel/node`更适合全局安装。

通过以下命令安装`@babel/core`和`@babel/cli`

```
npm install --save-dev @babel/core @babel/cli
```

然后配合`package.json`的`scripts`在项目中使用babel

```json
{
  "scripts": {
    "compile": "babel src --out-dir lib --watch"
  }
}
```

新建`src/index.js`:

```js
const fn = () => {
  console.log('a')
}
```

然后使用`npm run compile`命令进行编译，打开`lib/index.js`:

```js
const fn = name => {
  console.log(name);
};
```

为什么箭头函数没有被转换？

虽然，Babel是开箱即用的工具链，但是，如果不给Babel添加插件，前面提到的Babel的功能都无法使用。

# plugins（插件）

Babel插件通常分为两种：

- 语法插件：允许Babel解析特定的语法，以支持新的语法

- 转换插件：转换插件会默认启用语法插件，因为如果没法解析语法，根本无法进行转换。

因此使用插件的时候不需要同时指定两种插件。

# 使用插件

通常，我们会在项目下新建一个`.babelrc`文件对Babel进行特俗的设置，比如使用插件：

```json
// .babelrc
{
  plugins: ["@babel/plugin-transform-arrow-functions"]
}
```

我们可以在plugins这个字段中填入插件的名称，使用的时候，Babel会自动检查插件是否已经安装到`node_modules`目录下。

也可以使用绝对路径：

```json
// .babelrc
{
  plugins: ["./node_modules/@babel/plugin-transform-arrow-functions"]
}
```

再次打开`lib/index.js`，发现箭头函数语法已经被转换成普通函数语法。

```js
const fn = function (name) {
  console.log(name);
}; 
```

当我们还需要转换其他语法的时候，添加相对应的plugin就可以。

但是，ES这么多新语法，得安装多少插件？

所以，为什么解决这个问题，Babel提供了预设。

# preset（预设）

常用的预设比如：

- @babel/preset-env
- @babel/preset-react
- @babel/preset-typescript

**@babel/preset-env:**

`@babel/preset-env`主要是对我们使用并且目标浏览器中缺少的功能进行代码转换和加载`polyfill`。

在不进行任何配置的情况下，@babel/preset-env 所包含的插件将支持所有最新的JS特性(ES2015,ES2016等，不包含 stage 阶段)，将其转换成ES5代码。

```js
{
  "preset": ["@babel/preset-env"]
}
```

需要注意的是，`@babel/preset-env`会根据你配置的目标环境来生成插件列表然后进行编译。基于浏览器或者`Electron`的项目，官方推荐使用`.browserlistrc`文件来指定目标浏览器环境。

如果你没有在Babel配置文件中(如 .babelrc)设置 `targets` 或 `ignoreBrowserslistConfig`，`@babel/preset-env` 会使用 `browserslist` 配置源。

我们在项目下新建`browserslist`:

```json
last 2 Chrome versions
```

通过检查`lib/index.js`，因为Chrome的最新两个版本都支持箭头函数，所以不在转换箭头函数语法:

```js
const fn = name => {
  console.log(name);
};
```

添加prests和plugins可以解决一些语法的转换，但是，针对目标浏览器本来就没有的内置的函数或者实例方法，还需要加载polyfill来解决。比如：

```js
// index.js
const isHas = [1,2,3].includes(2)

const p = new Promise((resolve, reject) => {
    resolve(100)
});
```

运行Babel之后，箭头函数语法已经被转换，但是`Promise`和`includes`方法还存在：

```js
var isHas = [1, 2, 3].includes(2);
var p = new Promise(function (resolve, reject) {
  resolve(100);
});
```

如果在旧版浏览器上运行上述代码的话肯定会报错的。

# polyfill



