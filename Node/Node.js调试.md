# Node.js 调试

因为平常用的IDE就是vscode，所以用vscode调试的机会比较多。

## vscode debugging

详细的内容大家可以查看文档 [https://code.visualstudio.com/docs/editor/debugging](https://code.visualstudio.com/docs/editor/debugging)。我这调一些主要的内容讲一下：

#### 基本操作：

* `ctrl+shift+d` 可以直接跳转到 debug 的面板
* 直接编辑器的 bug 图标跳转到 debug 的面板
* 选择 menu 上边的 debug 可以查看 debug 相关的操作

#### 加载配置

* 通常在开启debug的时候会让你进行配置，这些配置会保存在根目录下的 `.vscode/launch.json` 文件中。
* 需要添加或者修改配置直接点击 `.vscode/launch.json` 文件，右下角有添加配置的按钮。

#### 配置模式

通常的配置模式有两种： Launch 和 Attach，在配置文件中主要体现在 `request`属性对应的值

* Lanuch 模式直接启动进入debug
* Attach 模式用于附加到已启动的程序

#### 基本的配置项

| 属性 | 说明 |
| :---: | :---: |
| type | debugger类型，比如 'node' 'php' 'go'等 |
|request|调试的模式，支持'luanch' 'attach' 这两个|
|name|当前配置的名称，无关紧要的一个配置|
|program|执行入口文件|
|env|环境变量|
|cwd|寻找依赖的当前目录|
|port|attach模式附加的进程端口号|
|console|选择使用哪种控制台，目前有三种 'internalConsole', 'integratedTerminal', 'externalTerminal'|

比较详细的内容都可以查看文档：[https://code.visualstudio.com/docs/nodejs/nodejs-debugging](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)