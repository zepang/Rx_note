# 前言

这篇文章包含以下几个点：

1. 什么是AST?

2. AST相关的概念和工具

3. AST目前在社区中的一些应用

4. Babel AST 处理

# 什么是AST？

AST: 全称Abstract Syntax Tree（抽象语法树），是源代码语法结构的一种抽象表示，对于熟悉使用JavaScript的开发者来说，可以简单的认为是一个JavaScript的树形对象(Tree Object)。

# AST相关的概念和工具

在学习AST之前，我们需要一个工具能够让我们清晰的看到代码与AST转换和关系，这个工具就是[AST Explorer](https://astexplorer.net/)

## AST Explorer

我们把如下代码粘贴到[AST Explorer](https://astexplorer.net/)左侧源码区：

```js
const ast = {
  message: 'Hello AST'
}
```

我们将会在左侧得到一个如下图所示的AST对象：

![](./astexplorer.png)

这就是AST，也就是我们今天要来学习和研究的对象。

好的，接下来，我们来学习一些AST中比较重要的概念。

## 节点--Node

节点是AST的基本组成对位，如果想直观的观察节点话，大家可以看下上一张截图中的黄色区域部分，这就是一个节点。

每个节点对象存储着一些信息，重要的属性如“type”，如下图：

![](./ast-code.png)

“type”定义了一个节点的类型。

那么，你就会有疑问了，比如这个类型是如何定义的？具体有那些类型？

### 节点类型是如何定义的？

从源码生成AST需要经过两个阶段：

- 分词/词法分析
- 语法/语法分析

看到这里，大家是不是想起了JavaScript的编译过程。

已经忘记的同学，我可以帮大家回忆一下。JavaScript代码编译到执行分为以下几个阶段：

1. 分词/语法分析
2. 语法/语法分析
3. 代码生成
4. 预编译
5. 引擎执行

编译过程中参与的成员主要有编译器，引擎，作用域。

编译器会参与1~4这几个阶段，预编译之后，交由解释引擎执行代码。作用域会交叉参与编译器和引擎负责的阶段。

其中，在语法分析阶段完成之后编译器会将源代码转换成抽象语法树。所以，节点的类型是有编译器转换的时候定义的。

关于节点的类型具体有哪些，大家可以看下MDN提供的Firefox SpiderMonkey Parser_API章节中提到的节点对象，这里展示了种各样的节点。或者可以看看[AST-types](https://github.com/benjamn/ast-types)这个仓库。

除此之外，社区也有很多不同的实现转换器，比如 babylon，esprima，acorn，@babel/parser等，当然节点对象的type可能会有差别。

[AST Explorer](https://astexplorer.net/)顶部可以选择不同的ast-parser，如下图：

![](./ast-parser.jpg)

## AST的应用

目前AST在前端这块的应用主要体现在代码操作方面（代码读写，增删改查等等），具体场景比如：代码语法、代码风格的检查，代码新旧语法转换，代码压缩与优化等等

我们举例一些应用了AST的工具，就能很快的理解上边所说的内容：

- eslint

- webpack

- babel

在现代化的前端项目中，AST已经是必不可少的一部分。

接下来我们以Babel提供的套件为例，简单的来看下 源码-AST-源码 的过程

## 源码-AST-源码

我们在社区中能够找到各种各样的库来实现源码-AST-源码的转换过程

比如：

1. 通过 esprima 把源码转化为AST
2. 通过 estraverse 遍历并更新AST
3. 通过 escodegen 将AST重新生成源码

我这里选择了Babel的套件，因为我认为Babel的提供的这些套件足够简单。

假如我们有一个`config.js`文件，它包含下边的一行代码

```js
// ...
const baseUrl = process.env.NODE_ENV !== 'production' ? '/' : '/static'
// ...
```

我们想把'/static'替换成'/__ASSET__ROOT'

```js
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import t from '@babel/types' 
import generate from '@babel/generator'

// 生成AST
const ast = parser(sourceCode)

// 遍历AST
traverse(ast, {
    VariableDeclarator (path) {
        const { node } = path
        // 找到对应的代码进行替换
        if (t.isIdentifier(node.id, { name: 'baseUrl' }) && t.isConditionalExpression(node.init)) {
            const alternate = t.stringLiteral('/__ASSET__ROOT__')
            node.init.alternate = alternate
        }
    }
})

// 输出代码
const { code } = generate(ast)
```

## https://rajasegar.github.io/ast-builder/