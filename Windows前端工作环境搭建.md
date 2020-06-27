# Windows前端工作环境搭建

系统：win10，毋庸置疑比win7适合开发

## 安装WSL和子系统Ubuntu

这部分网上教程很多，自己查阅，下边是子系统安装成功之后的内容

## 子系统Ubuntu换源

1. 备份文件

```
cd /etc/apt/
sudo cp sources.list sources.list.bak
```

2. 修改文件

```
sudo vim sources.list
```

不会vim操作的学习一下就好了，基本的操作很快就能上手

将里边的内容全部删除，从下边选择一个源替换

阿里源
```
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
```
中科大
```
deb https://mirrors.ustc.edu.cn/ubuntu/ bionic main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ bionic-security main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic-security main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse
```

3. 更新软件列表

```
sudo apt-get update
sudo apt-get upgrade
```

## 生成SSH Key

1. 运行如下命令一直按enter即可

```
ssh-keygen
```

2. 公钥保存在`~/.ssh/id_rsa.pub`

```
cat ~/.ssh/id_rsa.pub
```

3. 取到公钥上传到github或者gitlab中

## 安装编辑器

首选VSCode

下边是推荐的一些能够提升开发效率的插件：

1. GitLens

2. ProjectManager

3. EditorConfig for VSCode

4. Paht Intellisense

5. Setting Sync

6. 根据语言/框架选择对应的代码片提示段插件

## git已经自带

## node安装

推荐使用n/nvm进行node安装和管理，具体的用法请查看对应的文档

nvm换淘宝源：

```sh
echo -e "\nexport NVM_NODEJS_ORG_MIRROR=http://npm.taobao.org/mirrors/node" >> ~/.bashrc
source ~/.bashrc
```

n下载

```
curl -L https://git.io/n-install | bash
```

安装完毕之后需要对npm进行换源

临时使用

```
npm install -g nrm --registry=https://registry.npm.taobao.org
```

持久使用
```
npm config set registry https://registry.npm.taobao.org
```

使用nrm进行换源

```
nrm use taobao
```

```
sudo apt install -y build-essential
```

## 软件推荐

1. 浏览器

  - chrome
  - Firefox

2. 接口调试工具

  - Insomnia
  - Postman

3. 写作&笔记

  - WPS
  - Xmind Zen