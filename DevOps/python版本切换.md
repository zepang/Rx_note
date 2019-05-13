# python 版本切换换

### 别名切换

```shell
$ python --version
Python 2.7.6

$ alias python='/usr/bin/python3'
$ python --version
Python 3.4.3  # 版本已经改变
```

这个方法的前提是你已经安装了python3，如果还需要下次打开terminal之后继续使用需要将 `alias python='/usr/bin/python3'`添加到`~/.bashrc`文件中

### 连接块方式

```shell
$ ln -s python /usr/bin/python3
$ python --version
Python 3.4.3
```

### 采用update-alternatives 切换版本

```shell
$ update-alternatives --help
用法：update-alternatives [<选项> ...] <命令>

命令：
  --install <链接> <名称> <路径> <优先级>
    [--slave <链接> <名称> <路径>] ...
                           在系统中加入一组候选项。
  --remove <名称> <路径>   从 <名称> 替换组中去除 <路径> 项。
  --remove-all <名称>      从替换系统中删除 <名称> 替换组。
  --auto <名称>            将 <名称> 的主链接切换到自动模式。
  --display <名称>         显示关于 <名称> 替换组的信息。
  --query <名称>           机器可读版的 --display <名称>.
  --list <名称>            列出 <名称> 替换组中所有的可用候选项。
  --get-selections         列出主要候选项名称以及它们的状态。
  --set-selections         从标准输入中读入候选项的状态。
  --config <名称>          列出 <名称> 替换组中的可选项，并就使用其中
                           哪一个，征询用户的意见。
  --set <名称> <路径>      将 <路径> 设置为 <名称> 的候选项。
  --all                    对所有可选项一一调用 --config 命令。

<链接> 是指向 /etc/alternatives/<名称> 的符号链接。
    (如 /usr/bin/pager)
<名称> 是该链接替换组的主控名。
    (如 pager)
<路径> 是候选项目标文件的位置。
    (如 /usr/bin/less)
<优先级> 是一个整数，在自动模式下，这个数字越高的选项，其优先级也就越高。

选项：
  --altdir <目录>          改变候选项目录。
  --admindir <目录>        设置 statoverride 文件的目录。
  --log <文件>             改变日志文件。
  --force                  就算没有通过自检，也强制执行操作。
  --skip-auto              在自动模式中跳过设置正确候选项的提示
                           (只与 --config 有关)
  --verbose                启用详细输出。
  --quiet                  安静模式，输出尽可能少的信息。不显示输出信息。
  --help                   显示本帮助信息。
  --version                显示版本信息。

```
我们只需要三个参数就可以

```shell
--install <链接> <名称> <路径> <优先级>：建立一组候选项
--config <名称>：配置<名称>组中的可选项，并选择使用其中哪一个
--remove <名称> <路径>：从<名称>中去掉<路径>选项
```

首先我们先看一下有没有关于Python的可选项：
```shell
$ update-alternatives --display python
update-alternatives: 错误: 无 python 的候选项
```
那首先先建立python的组,并添加Python2和Python3的可选项

```shell
$ sudo update-alternatives --install /usr/bin/python python /usr/bin/python2.7 2 # 添加Python2可选项，优先级为2
$ sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.4 1 #添加Python3可选项，优先级为1
```

注意，这里的/usr/bin/python链接文件，两个可选项必须是一样的，这样这个链接文件才可以选择两个不同的可选项去链接。

这时如果我们查看/usr/bin/python这个文件时，会发现它已经链接到了/etc/alternatives/python。

```shell
$ python --version
Python 2.7.6
```

为什么还是Python2，看一下配置

```shell
$ sudo update-alternatives --config python 有 2 个候选项可用于替换 python (提供 /usr/bin/python)。

  选择       路径              优先级  状态
------------------------------------------------------------
* 0            /usr/bin/python2.7   2         自动模式
  1            /usr/bin/python2.7   2         手动模式
  2            /usr/bin/python3.4   1         手动模式
```

要维持当前值[*]请按回车键，或者键入选择的编号：
原来是因为默认选中了自动模式，而Python2的优先级高于Python3，这时候只要键入2，就可以使用Python3了。

如果你想要删除某个可选项的话：
`$ sudo update-alternatives --remove python /usr/bin/python2.7 update-alternatives`只适用于Debian系Liunx。

### virtualenvwrapper 切换版本

virtualenvwrapper是管理Python虚拟环境的工具，可以很方便的为不同的项目建立独立的环境，每个项目都可以安装自己的依赖，同时也支持在不同的虚拟环境中存在不同版本的Python。

首先安装virtualenvwrapper，可以选择apt安装或者pip安装

apt安装 

```shell
$ sudo apt-get install virtualenvwrapper
```

`$ sudo pip install virtualenvwrapper` 当你需要使用Python2开发项目时，建立一个Python2的虚拟环境：

`$ mkvirtualenv -p /usr/bin/python2 env27` 当你需要Python3开发时：

`$ mkvirtualenv -p /usr/bin/python3.4 env34` 然后可以随时切换不同的虚拟环境：

```shell
$ workon env27  # 进入Python2环境
$ workon env34  # 进入Python3环境
```

更爽的是，你可以在进入虚拟环境的同时切换到项目目录，只需要编辑`$VIRTUAL_ENV/bin/postactivate`这个文件即可：

`$ vim $VIRTUAL_ENV/bin/postactivate` #前提是已经进入对应的虚拟环境 在文件中添加切换目录的命令：

`cd /path/to/your/project` ### 0x05 总结
前面两种方法不推荐使用。

使用 `update-alternatives` 切换版本只适用于Debian系的Linux。

推荐使用 `virtualenvwrapper` 来管理虚拟环境和版本。

另外，本文介绍的切换不同版本软件的方法，除了 virtualenvwrapper 之外，前面3种方法都适用于其他软件，比如Java（open-jdk和oracle-jdk）。