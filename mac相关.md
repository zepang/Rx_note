# MAC查看与修改系统默认的shell

查看系统当前默认使用的shell有如下几个方法

一、查看所有的shell
```
cat /etc/shells

输出

# List of acceptable shells for chpass(1).
# Ftpd will not allow users to connect who are not using
# one of these shells.
 
/bin/bash
/bin/csh
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh
```
表示目前系统下有这么多版本的shell可用
二、查看当前窗口使用的shell版本（不要被一个叫 $SHELL 的单独的环境变量所迷惑，它被设置为你的默认 shell 的完整路径。因此，这个变量并不一定指向你当前使用的 shell。例如，即使你在终端中调用不同的 shell，$SHELL 也保持不变）
```
echo $SHELL
>>> /bin/bash
```

三、查看系统用户默认shell

```
cat /etc/passwd | grep sh

root:*:0:0:System Administrator:/var/root:/bin/sh
_sshd:*:75:75:sshd Privilege separation:/var/empty:/usr/bin/false
_update_sharing:*:95:-2:Update Sharing:/var/empty:/usr/bin/false
_mbsetupuser:*:248:248:Setup User:/var/setup:/bin/bash
```
可以看出root用户用的是sh，其他用户用的是bash

四、输出当前使用的shell（与三 、类似，但是比三更靠谱）
```
echo $0
 
>>>/bin/sh
```

然后，我们修改系统默认shell为bash,命令
```
chsh -s /bin/bash
```
————————————————

版权声明：本文为CSDN博主「瓜而不皮」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。

原文链接：https://blog.csdn.net/qq_32590631/java/article/details/93640599

# Mac 每次都要执行source ~/.bash_profile 配置的环境变量才生效

自己在 ~/.bash_profile 中配置环境变量, 可是每次重启终端后配置的不生效.需要重新执行 : $source ~/.bash_profile

发现zsh加载的是 ~/.zshrc文件，而 ‘.zshrc’ 文件中并没有定义任务环境变量。

解决办法

在~/.zshrc文件最后，增加一行：
source ~/.bash_profile

————————————————

版权声明：本文为CSDN博主「like学」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。

原文链接：https://blog.csdn.net/science_Lee/java/article/details/79214127