# 面试复习整理--css篇

## 1. 盒模型

盒模型主要有以下几部分组成：

* 内容（content）
* 内边距（padding）
* 边框（border）
* 外边框（margin）

盒模型分为两种：

1. 标准盒模型(w3c盒模型) 标准盒模型的 width = content
2. IE盒模型 IE盒模型的 width = padding + border + content

![](./盒模型.png)

默认的情况下，盒子都是基于标准盒模型的盒子。在css3中出现了 `box-sizing` 属性，该属性会改变默认盒子的盒模型。

该属性的两个属性值分别表示为：content-box（标准盒模型）和border-box（IE盒模型）。

## 2. BFC

块级格式上下文，是一个独立的渲染区域，让处于BFC内部元素与外部元素相互隔离，使内外元素的定位不会相互影响。

创建BFC的方式：

- 跟元素（html）

- 浮动元素（float值不为none）

- 绝对定位元素（position值为absolute或者fixed）

- 行内块级元素（display: inline-block）

- 表格单元格元素（display: table|table-caption|table-header-group|table-row-group|table-footer-group|table-row|table-cell 分别是HTML `<table> <caption> <thead> <tbody> <tfoot> <tr> <td>`的默认属性)

- overflow属性值不为visible的块元素

- display 值为 flow-root 的元素（**一个新的 display 属性的值，它可以创建无副作用的BFC。在父级块中使用 display: flow-root 可以创建新的BFC。**）

- contain 值为 layout、content 或 paint 的元素

- 弹性元素（display 为 flex 或 inline-flex 元素的直接子元素）

- 网格元素（display 为 grid 或 inline-grid 元素的直接子元素）

BFC的应用：

- 清浮动

- 防止margin重叠

- 防止字体环绕

![](./字体环绕1.png)

```html
<div class="container">
  <div class="floated">Floated div</div>
  <p>Quae hic ut ab perferendis sit quod architecto,dolor debitis quam rem provident aspernatur tempora expedita.
  </p> 
</div>

<style>
.container {
  width: 300px;
  border: 1px solid #e5e5e5;
}
.floated {
  padding: 20px;
  background: darkorange; 
  color: #fff;
  float: left;
}
p {
  background: deeppink; 
  margin: 0; 
}
</style>
```

![](./字体环绕2.png)

```css
p {
  background: deeppink; 
  margin: 0; 
  overflow: hidden;
}
```

- 自适应两栏布局


![](./自适应两栏布局1.png)


```html
<div class="box">
  <div class="left"></div>
  <div class="right"></div>
</div>

<style>
.right, .left {
  height: 200px;
}

.left {
  width: 200px;
  float: left;
  background-color: red;
}

.right {
  background-color: green;
}
</style>
```
![](./自适应两栏布局2.png)

```css
.right {
  background-color: green;
  overflow: hidden;
}
```

## 层叠上下文z-index

元素提升为一个比较特殊的图层，在三维空间中 (z轴) 高出普通元素一等。

![](./层叠等级.png)

