# 面试复习-浏览器篇

## 浏览器渲染UI的过程

1. 获取HTML文件，对HTML进行解析，并生成DOM Tree

2. 与此同时，进行css的解析，生成Style Rules

3. 接着将DOM Tree和Style Rules合成Render Tree

4. 进入布局（Layout）阶段（回流），为每个节点分配一个应出现在屏幕上的确切坐标，计算几何信息

5. 最后，通过上一步或得几何信息，调用CPU/GPU进行绘制（painting）（重绘）并展示元素

![](./浏览器渲染过程.png)

## 回流与重绘

回流：也叫重排，部分渲染树（或者整个的渲染树）需要重新分析或者尺寸需要重新计算，表现为重新生成布局，重新排列元素

重绘：由于节点的几何属性（不影响布局的属性）或者样式发生改变，例如改变元素背景颜色，表现为元素外观的改变

重排和重绘代价是高昂的，它们会破坏用户体验，并且让UI展示非常迟缓，而相比之下重排的性能影响更大，在两者无法避免的情况下，一般我们宁可选择代价更小的重绘

『重绘』不一定会出现『重排』，『重排』必然会出现『重绘』

## 何时会引发回流与重绘

* 添加或删除可见的DOM元素

* 元素的位置发生变化

* 元素的尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度等）

* 内容发生变化，比如文本变化或图片被另一个不同尺寸的图片所替代。

* 页面一开始渲染的时候（这肯定避免不了）

* 浏览器的窗口尺寸变化（因为回流是根据视口的大小来计算元素的位置和大小的）

* 根据改变的范围和程度，渲染树中或大或小的部分需要重新计算，有些改变会触发整个页面的重排，比如，滚动条出现的时候或者修改了根节点。

## 如何减少回流和重绘

- 浏览器的优化机制

现代浏览器都比较聪明,由于每次重排都会造成额外的计算消耗，因此大多数浏览器都会通过队列化修改并批量执行来优化重排过程。浏览器会将修改操作放入到队列里，直到过了一段时间或者操作达到了一个阈值，才清空队列。但是！**当你获取布局信息的操作的时候，会强制队列刷新**，比如当你访问以下属性或者使用以下方法：

* offsetTop、offsetLeft、offsetWidth、offsetHeight
* scrollTop、scrollLeft、scrollWidth、scrollHeight
* clientTop、clientLeft、clientWidth、clientHeight
* getComputedStyle()
* getBoundingClientRect
* 具体可以访问这个网站：[https://gist.github.com/paulirish/5d52fb081b3570c81e3a](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

以上属性和方法都需要返回最新的布局信息，因此浏览器不得不清空队列，触发回流重绘来返回正确的值。因此，我们在修改样式的时候，**最好避免使用上面列出的属性，他们都会刷新渲染队列。**如果要使用它们，最好将值缓存起来。

- 代码优化

  1. 集中改变样式

  ```js
  <!-- 使用cssText -->
  const el = document.getElementById('test');
  el.style.cssText += 'border-left: 1px; border-right: 2px; padding: 5px;';

  <!-- 修改类名 -->
  const el = document.getElementById('test');
  el.className += ' active';
  ```

  2. 批量修改dom

  当我们需要对dom进行一系列的操作的时候,可以通过以下步骤减少回流重绘次数:

  * 使元素脱离文档流
  * 对其进行多次修改
  * 将元素带回到文档中

  该过程的第一步和第三步可能会引起回流，但是经过第一步之后，对DOM的所有修改都不会引起回流重绘，因为它已经不在渲染树了

  有三种方式可以让DOM脱离文档流：

  * 隐藏元素，应用修改，重新显示
  * 使用文档片段(document fragment)在当前DOM之外构建一个子树，再把它拷贝回文档。
  * 将原始元素拷贝到一个脱离文档的节点中，修改节点后，再替换原始的元素。

  ```js
  function appendDataToElement(appendToElement, data) {
      let li;
      for (let i = 0; i < data.length; i++) {
        li = document.createElement('li');
          li.textContent = 'text';
          appendToElement.appendChild(li);
      }
  }
  const ul = document.getElementById('list');
  ul.style.display = 'none';
  appendDataToElement(ul, data);
  ul.style.display = 'block';
  ```

  ```js
  const ul = document.getElementById('list');
  const fragment = document.createDocumentFragment();
  appendDataToElement(fragment, data);
  ul.appendChild(fragment);
  ```

  ```js
  const ul = document.getElementById('list');
  const clone = ul.cloneNode(true);
  appendDataToElement(clone, data);
  ul.parentNode.replaceChild(clone, ul);
  ```

  其实思路都是减少操作dom的次数,**但是现代浏览器会使用队列来储存多次修改，进行优化，所以对这个优化方案，我们其实不用优先考虑。**

  - 硬件加速（GPU加速）

  
  比起考虑如何减少回流重绘，我们更期望的是，根本不要回流重绘。这个时候，css3硬件加速就闪亮登场啦！！

  1. 使用css3硬件加速，可以让transform、opacity、filters这些动画不会引起回流重绘 。

  2. 对于动画的其它属性，比如background-color这些，还是会引起回流重绘的，不过它还是可以提升这些动画的性能。

  **如何触发硬件加速**

  常见的触发硬件加速的css属性：

  * transform
  * opacity
  * filters
  * Will-change

  所以我们可以通过硬编码的方式开启硬件加速, 比如

  ```css
  .example1 { transform: translateZ(0); } 
  .example2 { transform: rotateZ(360deg); }
  ```

  最好方式是使用 CSS 的 will-change 属性：

  ```css
  #target {
    will-change: transform;
  }
  ```

  **css3硬件加速的坑**

  当然，任何美好的东西都是会有对应的代价的，过犹不及。css3硬件加速还是有坑的:

  1. 如果你为太多元素使用css3硬件加速，会导致内存占用较大，会有性能问题
  2. 在GPU渲染字体会导致抗锯齿无效。这是因为GPU和CPU的算法不同。因此如果你不在动画结束的时候关闭硬件加速，会产生字体模糊

## defer和async

![](./async&&defer.webp)

defer和async属性仅适用于外部脚本，也就是只有存在src属性的时候才会生效。

async的优先级比defer高，如果同时存在defer和async属性，浏览器会选择async方式加载文件。

## preload和prefetch

在我们的浏览器加载资源的时候，对于每一个资源都有其自身的默认优先级。

以谷歌浏览器为例，我们打开控制台，并切换到Network选项，点击刷新页面，在网络下面的title一行点击鼠标右键，勾选Priority即可看到加载资源的优先级，我们可以看到样式的级别比脚本的优先级高，毕竟页面的一加载进来肯定是样式首先需要渲染的，不然整个页面便会四分五裂，用户体验不好。

![](./chrome-network-priority.webp)

通过添加preload属性可以告知浏览器应该尽快的加载某个资源

```html
<link as="script" rel="preload" href="foo.js">
```

如果提取的资源3s内未在当前使用，在谷歌开发工具将会触发警告消息

![](./chrome-preload-warning.webp)

prefetch属性可以告知浏览器页面加载完成后，在带宽可用的情况下，加载用户下一步期待的页面资源

```html
<link rel="prefetch" href="foo.html">
```

## dns-prefetch域名预解析

解析域名的时间很短，但是也会有延迟，并且不是所有的浏览器都一定会对解析后的域名进行缓存，所以，我们告知浏览器提前对域名进行预解析，并缓存

```html
<link rel="dns-prefetch" href="//domain.com">
```

## cookie、localStorage和sessionStorage

