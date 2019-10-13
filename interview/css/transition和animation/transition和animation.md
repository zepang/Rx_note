# transition 和 animation

这边内容不是为刷题而记录，只是因为最近写css3动画，突然觉得对transition和animation的属性不是特别了解，特意记录一下，加深印象。

# transition

css的transition允许css的属性值在一定的时间内平滑过渡。

### 语法

```css
transition: width .25s ease .1s;
/* transiton: <transition-property> <transition-duration> <transition-time-function> <transition-delay>; */
```

* transition-property

有三种值：all || none || 具体的属性值，常用 all，选择多种属性值变化

* transition-duration

过渡时间，单位可以是`s`或者`ms`

* transition-time-function 

值有6种可能，`liner, ease, ease-in, ease-out, ease-in-out, cubic-bezier(x1,y1,x2,y2)`

前五种直接看下图：

![](./transition-timing-function.png)

cubic-bezier

![](./cubic-bezier.png)

cubic-bezier()中的四个值x1,y1,x2,y2代表p1(x1,y2)和p(x2,y2)的横纵坐标值

* transition-delay

表示过渡开始的时间，单位可以是`s`或者`ms`

# animation

语法：

```css
animation: slide .25s ease .1s 1 normal forwards;
/* animation: animation-name animation-duration animation-time-function animation-delay  animation-direction animation-fill-mode; */
```

* animation-name

用来定义一个动画的名称，名称取自于`@keyframes name`定义的名称，

* animation-duration

动画时长，单位可以使`m`或`ms`

* animation-time-function 

同`transition`的`animation-time-function`一样

* animation-delay

动画的开始时间，单位可以使`m`或`ms`

* animation-iteration-count

动画播放的次数，值可以使 `infinite` 或者指定具体的数字

* animation-direction

有以下四个取值：

    1. normal

    每个循环内动画向前循环，换言之，每个动画循环结束，动画重置到起点重新开始，这是默认属性。
    
    2. alternate
    
    动画交替反向运行，反向运行时，动画按步后退，同时，带时间功能的函数也反向，比如，ease-in 在反向时成为ease-out。计数取决于开始时是奇数迭代还是偶数迭代
    
    3. reverse
     
    反向运行动画，每周期结束动画由尾到头运行。
    
    4. alternate-reverse

    反向交替， 反向开始交替
    动画第一次运行时是反向的，然后下一次是正向，后面依次循环。决定奇数次或偶数次的计数从1开始。


* animation-fill-mode

具体的取值可以查看[https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-fill-mode](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-fill-mode)
