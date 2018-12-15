# 利用 performance API 来分析网站的性能

window.performance.timing 对象包含了完整的网页加载性能数据。

* 页面的第一个时间点是navigationStart，表示上一个页面unload事件的触发。
* fetchStart: 表示开始获取当前页面的内容。
* fetchStart - navigationStart: 是浏览器内核为加载页面做的一些准备工作。
* domainLookupStart: 开始 DNS 解析的时间点
* domainLookupStart - fetchStart : 查询缓存的时间
* domainLookupEnd: 结束 DNS 解析的时间点
* domainLookupEnd - domainLookStart: DNS 解析所花的时间
* connectStart: tcp 开始连接
* connectEnd: tcp 建立连接
* requestStart: 开发发请求到服务器
* requestEnd: 浏览器收到完整的响应结果
* domLoading: dom 树解析开始
* domInteractive: dom 树解析完成，页面以来的外部资源：css, js, image等还未加载
* 接下来会加载外部资源和执行js脚本，一旦页面脚本加载完毕，就会触发 DOMContentLoaded 事件, 对应的时间点是： domContentLoadedStart
* domContentLoadedEnd: 表示开发者注册在 DOMContentLoaded 事件中的脚本执行完毕
* domComplete: 外部资源加载和解析完毕，同时触发load事件
* loadEventStart: load事件开发触发
* loadEventEnd: 表示开发者注册在load事件中的基本执行完毕
