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

# 