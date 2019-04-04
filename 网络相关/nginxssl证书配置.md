# Nginx SSL 证书的配置

这里用的是阿里云上边申请的免费证书，网上还有很多其他的方法也可以申请和使用免费证书，大家可以去搜一下。

# 环境

* centos7
* nginx
* 阿里云申请的免费证书

# 证书申请

关于如何申请免费证书我这里就不多说了，网上有很多的教程，我之前参考的是这篇文章：[阿里云免费证书DV SSL申请过程记录](https://yq.aliyun.com/articles/657095?spm=5176.10695662.1996646101.searchclickresult.14b75440urZ0EK)

申请需要一定的时间签发，签发完成后可以直接下载证书。我们下载对应的nginx证书，有两个文件`xxx.pem` `xxx.key`

接下来把证书保存到服务器，我的目录是 /etc/nginx/cer

# 配置nginx

这里我直接贴配置信息把，不是很懂这块配置的可以查看一下nginx的官方文档[Configuring HTTPS servers](http://nginx.org/en/docs/http/configuring_https_servers.html), 或者直接查看阿里云的帮助文档[Nginx/Tengine服务器安装SSL证书](https://help.aliyun.com/knowledge_detail/95491.html?spm=5176.2020520154.cas.25.3cf8kCdSkCdSPy)

```nginx
server {
  listen  443 ssl;
  server_name  example.top www.example.top;
  root  /home/www/example.top;
  ssl_certificate  /etc/nginx/cer/2018421_www.example.top.pem;
  ssl_certificate_key /etc/nginx/cer/2018421_www.example.top.key;
  ssl_session_timeout 5m;
  ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_prefer_server_ciphers on;
  location / {
    index  index.html;
  }
}
server {
  listen 80;
  server_name example.top www.example.top;
  if ($host ~* "^example.top$") {
    rewrite ^/(.*)$ https://www.example.top/ permanent;
  }
}
```

对上边的配置做一个简单的说明，443 ssl 端口的配置主要是需要关心证书的path，下边的 80 端口是用来强制将 www.example.top 或者 example.top 或者 http://example.top 的访问方式转成https的访问。