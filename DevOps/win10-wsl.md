# win10 WSL子系统前端开发环境配置

### 子系统安装和开启

子系统的安装和开启我直接跳过，这部分内容网上过多。我这边使用的`ubuntu-18.04`

### nodejs的安装

具体安装参考[https://github.com/nodesource/distributions/blob/master/README.md](https://github.com/nodesource/distributions/blob/master/README.md)

这里选择Node.js v10.x:

```shell
# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -sL https://deb.nodesource.com/setup_10.x | bash -
apt-get install -y nodejs

node --version
npm --version
```

### yarn 安装

`npm`已经在安装`node.js`的时候自动安装，如果需要用到`yarn`:

```shell
https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update && sudo apt-get install yarn

yarn --version
```

### ssh安装和开启

win10环境下有的时候可能会需要传输文件到子系统内部。有两种方式，一种是通过子系统和win10共享的目录`/mnt`进行拷贝，一种就是开个ssh直接上传，win10习惯用`winscp`软件，所以给子系统装了个ssh。

```shell
sudo dpkg-reconfigure openssh-server

vim /etc/ssh/sshd_config

Port 2222
# ...
UsePrivilegeSeparation no
# ...
PasswordAuthentication yes

# 启动
sudo service ssh --full-restart
```
因为win10上边的22端口需要对外用，所以使用2222端口，另外还需要开放win10防火墙的入站规则。

### MySQL

```shell
sudo apt-get install mysql-server mysql-client

sudo service mysql start

sudo mysql
```
