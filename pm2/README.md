# pm2 相关问题

pm2 运行过程中，明明项目中已经安装pm2，却遇到无法找到pm2中的一些模块的时候.

比如如下报错：

```
....
cannot find module pm2/lib/processcontainerfork.js
```

解决：

```
# 删除下边的文件目录，重新启动pm2服务
rm -rf ~/.pm2
```