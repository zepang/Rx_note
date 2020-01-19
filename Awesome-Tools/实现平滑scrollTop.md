# 实现平滑的scrollTop过渡

* 仅仅使用css

```css
html {
    scroll-behavior: smooth;
}
```

目前兼容极差

* 使用Window.scrollTo API

```js
window.scrollTo({
    left: 0,
    top: 0,
    behavior: 'smooth'
})
```

兼容性比上一个方案好一点，但是有的浏览器不一定有效果，比如Safari

* 使用requestAnimationFrame

```js
const scrollToTop = () => {
    let scrollTop = document.documentElement.scrollTo || document.body.scrollTop
    if (scrollTop > 0) {
        window.requestAnimationFrame(scrollTop)
        window.scrollTop(0, scrollTop - scrollTo / 8)
    }
}
```

兼容性比上边两种方案都要好

* 使用第三方库smooth-scroll

推荐使用第三方库