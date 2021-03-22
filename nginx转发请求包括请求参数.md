# nginx转发请求包括请求参数

> 原文：https://stackoverflow.com/questions/8130692/how-can-query-string-parameters-be-forwarded-through-a-proxy-pass-with-nginx

三种解决方式：

```nginx
location /service/ {
  # Note the trailing slash on the proxy_pass.
  # It tells nginx to replace /service/ with / when passing the request.
  proxy_pass http://apache/;
}
```

```nginx
location ~* ^/service/(.*) {
  proxy_pass http://apache/$1$is_args$args;
}
```

```nginx
location /service/ {     
  rewrite ^\/service\/(.*) /$1 break;     proxy_pass http://apache; 
}
```

