# cookie 和 session 的区别

1、Cookie和Session都是会话技术，Cookie是运行在客户端，Session是运行在服务器端。
   
2、Cookie有大小限制以及浏览器在存cookie的个数也有限制，Session是没有大小限制和服务器的内存大小有关。

3、Cookie有安全隐患，通过拦截或本地文件找得到你的cookie后可以进行攻击。

4、Session是保存在服务器端上会存在一段时间才会消失，如果session过多会增加服务器的压力。

5、域的支持范围不一样，比方说www.a.com的Cookie在a.com下都能用，而www.a.com的Session在api.a.com下都不能用，解决这个问题的办法是JSONP或者跨域资源共享。