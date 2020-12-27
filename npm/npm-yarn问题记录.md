# npm i -g 安装全局包权限问题

官网解决： [https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)

# yarn global 安装全局包找不到命令的问题

问题原因：执行的命令所在目录不在系统执行路径下

解决方案：

```
vim ~/.profile

# 添加至文件末尾

export PATH="/home/zepang/.npm-global/bin:$PATH"

sudo source ~/.profile
```