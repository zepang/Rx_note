# 使用scroll-snap（滚动捕捉）更好的控制滚动
> 原文链接  [https://developers.google.com/web/updates/2018/07/css-scroll-snap#dom_scrolling_api](https://developers.google.com/web/updates/2018/07/css-scroll-snap#dom_scrolling_api)


[CSS Scroll Snap](https://developers.google.com/web/updates/2018/07/css-scroll-snap#dom_scrolling_api)特性允许 web 开发者通过声明 scroll snap postion 来创建控制性好的滚动体验。分页的文章和图片轮播是非常常见的两种例子。需要注意的一点是，虽然这个特性讨论了好几年，但是目前的兼容性不是很好。

* 使用方式

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>scroll-snap</title>
  <style>
    .container {
      scroll-snap-type: x mandatory;
      overflow-x: scroll;
      display: flex;
    }

    .container img {
      scroll-snap-align: center;
      min-width: 80%;
      height: 200px;
      background-color: #eeeeee;
    }

    .container img:not(:last-child) {
      margin-right: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="" alt="">
    <img src="" alt="">
    <img src="" alt="">
    <img src="" alt="">
  </div>
</body>
</html>
~~~

需要给容器添加捕捉滚动的属性 scroll-snap-type，选择 x, y 轴方向，然后给容器内的子项，添加对其方式 scroll-snap-align，对其方式规定了子项在滚动后在容器中的位置，主要有 start, center, end



