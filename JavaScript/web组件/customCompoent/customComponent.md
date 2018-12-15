# customComponent

能够在 HTML 页面上创建封装功能的自定义元素是 Web 标准组件的未来特性之一。接下来就是开始介绍如何使用自定义元素的 API。

* CustomElementRegisty { Object }

允许你在页面上注册自定义的元素

~~~js
customElements.define('word-count', WordCount, { extends: 'p' });
~~~

    define 这个方法接受三个参数，第一个是自定义元素的名字，第二个是一个constructor，第三个是一个对象，用来指定继承已经创建的元素。具体的看文件夹下的两个例子。


