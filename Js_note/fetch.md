# Javascript Fetch Api

* fetch 与XMLHttpRequest一样用于ajax的操作

* fetch方法返回一个Promise

* fetch是全局方法

~~~js
const req = new Request(URL, {method: 'GET', cache: 'reload'})

fetch(req).then(res => console.log(res))

// 或者

fetch(URL, {method: 'POST'}).then(res => console.log(res))
~~~

# Request

* Request构造函数接受一个或者两个函数
* 第一个是URL，第二个参数是可选的对象

~~~js
const req = new Request('http://....')

fetch(req)
  .then(res => {
    // res 是一个Response 对象，必须将它转为blob,formData,json...等格式
    return res.blob
  })
  .then(blob => {
    /*
    | 在這裡我們要將blob轉為圖片src
    | 使用 URL.createObjectURL
    */
    const img = new Image

    // 允許跨域，確保可以正確用於 canvas
    img.crossOrigin = 'anonymous'

    // 將blob 轉為dataURL
    img.src = URL.createObjectURL(blob)

    // 將元素渲染至 body
    document.body.appendChild(img)
  })
~~~

# Headers

* 是Request的一个属性
* headers属性接受一个键值对的对象

~~~js
// 实例化header

const init = { 'token': 'hello' }
const headers = new Headers(init)

console.log(headers.get('token')) //hello
console.log(headers.has('token'))
headers.set('token2', 'it 30 days')
headers.append('my', '123455')

// keys array
headers.keys()
// values array
headers.values()
// 对象集合
headers.entries()

# Response

~~~js
const req = new Request('https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png?201709101434')

fetch(req)
  .then(res => {
      console.log(res.constructor.name)   // "Response"
      return res.blob()
  })
  .then(imgBlob => {
      const imgSrc = URL.createObjectURL(imgBlob)
      const image = new Image
      image.src = imgSrc
      document.body.appendChild(image)
      // 更多的處理 ...
  })
~~~

上边代码说明两点：
* fetch 方法回传的是resolve是一个Response实例
* Response实例需要经过处理（例如.blob()）才能真正被使用

~~~js
const headers = new Headers({
  'token': 'hello'
})

const formData = new FormData()
formData.append('email', 'example@email.com')

const req = new Request('https://my/perfect/api.io', {
  method: 'POST',
  headers: headers,
  body: formData
})

fetch(req)
  .then(res => res.json())
  .then(resJson => {
    console.log(resJson)
  })
~~~
