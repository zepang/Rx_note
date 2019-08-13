## 怎么让一个div垂直居中

```html
<div class="parent">
  <div class="child"></div>
</div
```

1. flex
 
```css
div.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```
2. flex + margin

```css
div.parent {
  display: flex;
}
div.child {
  margin: auto;
}
```

3. position + transform

```css
div.parent {
  position: relative;
}
div.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

4. position + margin

```css
div.parent {
  position: relative;
}
div.child {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
/* 已知子元素的宽高情况下 可以使用下面布局 */
div.child {
  width: 50px;
  height: 50px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -25px;
  margin-top: -25px;
}
```

5. table-cell + inline-block

```css
div.parent {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
div.child {
  display: inline-block;
}
```

5. vertical-align + inline-block

```css
div.parent {
  font-size: 0;
  text-align: center;
}
div.parent:before {
  content: '';
  display: inline-block;
  width: 0;
  height: 100%;
  vertical-align: middle;
}
div.child {
  display: inline-block;
  vertical-align: middle;
}
```

6. grid + margin

```css
div.parent {
  display: grid;
}
div.child {
  margin: auto;
}
```
