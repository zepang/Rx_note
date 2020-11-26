#  Docker&&Jenkins环境创建.md

参考：
- https://yeasy.gitbook.io/docker_practice/
- https://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html 
- https://www.jenkins.io/

# docker暗转

为了简单快速安装，使用dokcer desktop for mac 版本，步骤我就不多说了，可视化操作

安装完成之后，点击应用图标进行启动，在mac顶部的状态栏可以看到docker应用的图标

打开终端，查看docker和docker-compose版本，确保已经完全安装

```
docker --version

Docker version 19.03.13, build 4484c46d9d

docker-compose --version

docker-compose version 1.27.4, build 40524192
```

# jekins安装

jekins官网的文档建议使用的jekins镜像为 https://hub.docker.com/r/jenkinsci/blueocean/

打开镜像地址，按照说明，在命令行进行安装：

```
# 修改下主机的端口
docker run -p 49000:8080
```

打开 `http://localhost:49000`，即可看到jekins初始化页面，如下图



按照提示，我们进入jekeins 容器，获取密码，然后进行登陆

```
cat /var/jenkins_home/secrets/initialAdminPassword
```
