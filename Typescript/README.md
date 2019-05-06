# TypeScript 学习记录

官方文档：[http://www.typescriptlang.org](http://www.typescriptlang.org)

# 为什么需要TypeScript?

* TypeScript添加了类型检查，比直接写JavaScript更加安全，尤其的在node相关的应用程序，我觉得更加要使用TypeScript的类型检查
* 编辑器（尤其是vscode）给了TypeScript更好的提示
* 虽然我们也可以使用最新的JavaScript语法，然后用babel进行转换，但是毕竟需要用到babel，TypeScript有自己的编译配置，我觉得很方便
* TypeScript越来越来越流行，这应该算是一个趋势

# TypeScript编译执行的过程

1. TypeScript source -> TypeScript AST
2. TypeScript AST is checked by typecheker(if error emit error)
3. TypeScript AST -> JavaScript source
4. JavaScript source -> JavaScript AST
5. JavaScript AST -> bytecode
6. Bytecode is evaluated by runtime

上边的过程有个概念就可以，记下来看看TypeScript的使用。

# 安装TypeScript

```shell
npm install -g typescript

tsc --version

tsc --help

```

在开始使用之前，我们需要了解两个文件

## tsconfig.json

通常的我们可以通过`tsc --init`命令在TypeScript的根目录下创建一个`tsconfig.json`文件，这个文件会声明项目编译的跟文件和编译选项。关于tsconfig.json的配置选项可以查看(http://www.typescriptlang.org/docs/handbook/compiler-options.html)[http://www.typescriptlang.org/docs/handbook/compiler-options.html]，下面提一下需要常用的，必须了解的选项：

### 文件
 
* rootDir 指定编译输入文件的目录
* outDir 指定编译输出文件的目录

* baseUrl 用于解析非相对模块的基本目录, 关于相对和非相对模块的内容可以查看(http://www.typescriptlang.org/docs/handbook/module-resolution.html)[http://www.typescriptlang.org/docs/handbook/module-resolution.html]
* paths 指定特殊模块的模块的路径，这个路径是相对于baseUrl的路径

* sourceMap 接收一个boolean，用于生成sourceMap方便调试
* sourceRoot 用于指定sourceMap的路径

* files 接收一个文件目录的数组，用于包含编译文件
* include 指定需要编译的文件，比files灵活
* exclude 指定不需要编译的文件

* outfile 通常用于输出单个js文件，使用这个选项的时候可以移除outdir

### type 文件

* typeRoots  指定type（.d.ts）文件的目录，通常是node_modules，有的时候你需要指定自定义的type文件
* types  指定type文件的路径，接收路径组成的数组

* strict 开启所有严格检查，最好默认开启

### ECMScript

* target 指定需要编译的目标版本，通常是es5，其它选项可以查看文档说明
* lib 指定编译需要注入的库，比如DOM，ES5等，如果不指定的情况下，会根据我们配置的target默认引入一些库，具体查看文档

### 关于tsconfig.json配置文件

通常在命令行通过 -p 指定配置文件

```shell
tsc -p tsconfig.json
```

tsconfig.json可以接收一个 extend 的配置选项，用于继承其他的配置选项，通常用于不同环境下的配置文件中。

## tslint.json

tslint.json是TypeScript的语法校验配置文件，通常我们可以使用下边的命令生成tslint.json文件

```shell
./node_modules/.bin/tslint --init

cat tslint.json

{
  "defaultSeverity": "error",
  "extends": [
      "tslint:recommended"
  ],
  "jsRules": {},
  "rules": {},
  "rulesDirectory": []
}
```

具体的用法可以查看(https://palantir.github.io/tslint/usage/configuration/)[https://palantir.github.io/tslint/usage/configuration/]，实际上和eslint这一类语法校验工具类似

# 基本的类型

(http://www.typescriptlang.org/docs/handbook/basic-types.html)[http://www.typescriptlang.org/docs/handbook/basic-types.html]
