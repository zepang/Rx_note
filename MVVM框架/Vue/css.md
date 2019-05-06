# vue 项目css解决方案

> 2018年 5月25日 星期五 10时22分22秒

目前主要存在三种：

* 最开始使用Vue的时候，提倡大量使用的scoped的这种技术，但是这种技术用户全局定义的css会影响局部的一些内容

~~~css
<style scoped>

</style>
~~~

这个scoped属性，会在html标签内添加一个唯一的属性

~~~html
<div data-v-8fada6c2 class="condition-title"></div>
~~~

css编译如下
~~~css
.condition-title[data-v-8fada6c2] {
  /** */
}
~~~

* css in js

测地抛弃css，使用JavaScript来写css规则，常见的styled-components

* css modules

css module的实现方式主要依赖css-loader，生成唯一的命名，不会有任何的冲突