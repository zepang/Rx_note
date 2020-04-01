
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

`@babel/polyfill`模块包含两部分`core-js`和`regenerator runtime`

注意：V7.4.0 版本开始，@babel/polyfill 已经被废弃(前端发展日新月异)，需单独安装 core-js 和 regenerator-runtime 模块。请大家注意自己使用的babel版本。

```
npm install --save core-js@3
npm install --save regenerator-runtime
```

默认情况下会引入core-js支持所有的新特性的polyfill，可以通过设置`useBuiltIns`值为`usage`来实现按需引入，不使用的新特性将不会引入polyfill以节省空间。

```json
{
  "presets": [
    [
      "@babel/preset-env", 
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ]
}
```

然后，我们可以看到babel处理后的文件包含了一些polyfil:

```js
require("core-js/modules/es.array.includes");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");
```


# @babel/plugin-transform-runtime

比如，我们添加如下代码：

```js
class Animal {
  constructor (name) {
    this.name = name
  }

  getName () {
    return this.name
  }
}

const dog = new Animal('dog')
```

创建other.js添加相同的代码。

用babel处理后，你就会发现lib下的other和index文件中都存在了以下相同代码：

```js
function _classCallCheck(instance, Constructor) {...}
function _defineProperties(target, props) {...}
function _createClass(Constructor, protoProps, staticProps) {...}
```

babel在给我们转换语法的时候会用到一些小的辅助方法，上边的三个就是。因为，index和other文件中都需要这些方法，所以，babel给每个文件分别注入了一份。

@babel/plugin-transform-runtime 是一个可以重复使用 Babel 注入的帮助程序，以节省代码大小的插件。

@babel/plugin-transform-runtime 需要和 @babel/runtime 配合使用。

@babel/plugin-transform-runtime 通常仅在开发时使用，但是运行时最终代码需要依赖 @babel/runtime，所以 @babel/runtime 必须要作为生产依赖被安装，如下:

```
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime
```

并在.babelrc添加如下配置：

```json
{
  ...
  "plugins": [
    [
      "@babel/plugin-transform-runtime"
    ]
  ]
}
```

下边是babel处理后的文件：

```js
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
```

帮助函数不会直接注入到文件中，而是从`@babel/runtime`中重新引入。

### 避免全局污染

@babel/plugin-transform-runtime还能够帮助处理变量全局污染的问题。

```json
{
  ...
  "plugins": [
    [
      "@babel/plugin-transform-runtime", {
        "corejs": 3
      }
    ]
  ]
}
```

以下是前后的对比：

```js
// 处理前
var isHas = [1, 2, 3].includes(2);
var p = new Promise(function (resolve, reject) {
  resolve(100);
});

```

```js
// 处理后
var isHas = (0, _includes["default"])(_context = [1, 2, 3]).call(_context, 2);
var p = new _promise["default"](function (resolve, reject) {
  resolve(100);
});
```

## 插件的排序顺序很重要

如果两个转换插件都将处理程序的某个代码片段，则将根据插件或者`preset`的排列顺序依次进行。

- 插件在Presets前运行

- 插件顺序从前往后

- presets 顺序从后往前


## 插件参数和短名称

插件设置参数可以使用以下的形式：

```json
{
    "plugins": [
        [
            "@babel/plugin-proposal-class-properties", 
            { "loose": true }
        ]
    ]
}
```

插件如果是按照`@babel/plugin-xxx`这种格式命名，可以使用短名称`@babel/xxx`

```json
{    
  "plugins": [        
    "newPlugin", //同 "babel-plugin-newPlugin"        
    "@scp/myPlugin" //同 "@scp/babel-plugin-myPlugin"    
]}
```

## babel的配置方式

- .babelrc

```json
{
  "presets": [],
  "plugins": []
}
```

- package.json

```json
{
  "babel": {
    "presets": [],
    "plugins": []
  }
}
```

- .babelrc.js

```js
module.export = {
  presets: [],
  plugins: []
}
```