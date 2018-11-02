# JSDOC(js 文档注释)

## [jsdoc 中文教程](http://www.css88.com/doc/jsdoc/index.html)

# 安装

~~~shell
npm install -g jsdoc
jsdoc --help
~~~

# 基本使用
~~~js
/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
function Book(title, author) {
}
~~~

就是在函数注释边按照特定的 tag 写注释和类型或者其他的说明，也可以写 example 或者 教程等等，然后：

~~~shell
jsdoc demo.js
~~~

将会在根目录下身材默认的out目录

也可以自定义配置，具体查看[用conf.json配置JSDoc](http://www.css88.com/doc/jsdoc/about-configuring-jsdoc.html)

具体的标签，查看[快标签](http://www.css88.com/doc/jsdoc/tags.html)， [内联标签](http://www.css88.com/doc/jsdoc/inline-tags.html)

