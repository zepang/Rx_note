# 安装RedHatLinux

内容比较简单，跳过

# 重置root密码

进入系统之后可以通过 `cat /etc/reahat-release` 来查看系统的版本信息。

重启虚拟机进入引导页面，按下`e键`进入内核编辑页面

找到linux16这一行的末尾加上`\rd.break`，使用`ctrl+x`运行

大约过三30秒进行紧急救援模式

输入`mount`命令查看，发现跟为`/sysroot`，并且为只读

以读写权限重新挂载`/sysroot`

    mount -o remount,rw /sysroot

输入`mount`命令查看`/sysroot`已经有读写权限

将跟改为`/sysroot`, 并在根下创建.autorelabel文件

    chroot /sysroot
    touch /.autorelabel

输入 `passwd`，然后输出新密码，确认密码并以`exit`退出，之后重启`reboot`

# RPM红帽软件包

在RPM（红帽软件包管理器）公布之前，要想在Linux系统中安装软件只能采取源码包的方式安装。早期在Linux系统中安装程序是一件非常困难、耗费耐心的事情，而且大多数的服务程序仅仅提供源代码，需要运维人员自行编译代码并解决许多的软件依赖关系，因此要安装好一个服务程序，运维人员需要具备丰富知识、高超的技能，甚至良好的耐心。而且在安装、升级、卸载服务程序时还要考虑到其他程序、库的依赖关系，所以在进行校验、安装、卸载、查询、升级等管理软件操作时难度都非常大。

RPM机制则为解决这些问题而设计的。RPM有点像Windows系统中的控制面板，会建立统一的数据库文件，详细记录软件信息并能够自动分析依赖关系。目前RPM的优势已经被公众所认可，使用范围也已不局限在红帽系统中了。

<table id="tablepress-191" class="tablepress tablepress-id-191">
<tbody class="row-hover">
<tr class="row-1 odd">
<td class="column-1">安装软件的命令格式</td>
<td class="column-2">rpm -ivh filename.rpm</td>
</tr>
<tr class="row-2 even">
<td class="column-1">升级软件的命令格式</td>
<td class="column-2">rpm -Uvh filename.rpm</td>
</tr>
<tr class="row-3 odd">
<td class="column-1">卸载软件的命令格式</td>
<td class="column-2">rpm -e filename.rpm</td>
</tr>
<tr class="row-4 even">
<td class="column-1">查询软件描述信息的命令格式</td>
<td class="column-2">rpm -qpi filename.rpm</td>
</tr>
<tr class="row-5 odd">
<td class="column-1">列出软件文件信息的命令格式</td>
<td class="column-2">rpm -qpl filename.rpm</td>
</tr>
<tr class="row-6 even">
<td class="column-1">查询文件属于哪个RPM的命令格式</td>
<td class="column-2">rpm -qf filename</td>
</tr>
</tbody>
</table>

# Yum软件仓库

尽管RPM能够帮助用户查询软件相关的依赖关系，但问题还是要运维人员自己来解决，而有些大型软件可能与数十个程序都有依赖关系，在这种情况下安装软件会是非常痛苦的。Yum软件仓库便是为了进一步降低软件安装难度和复杂度而设计的技术。Yum软件仓库可以根据用户的要求分析出所需软件包及其相关的依赖关系，然后自动从服务器下载软件包并安装到系统。

Yum软件仓库中的RPM软件包可以是由红帽官方发布的，也可以是第三方发布的，当然也可以是自己编写的。

<table id="tablepress-76" class="tablepress tablepress-id-76">
<tbody class="row-hover">
<tr class="row-1 odd">
<td class="column-1">命令</td>
<td class="column-2">作用</td>
</tr>
<tr class="row-2 even">
<td class="column-1">yum repolist all</td>
<td class="column-2">列出所有仓库</td>
</tr>
<tr class="row-3 odd">
<td class="column-1">yum list all</td>
<td class="column-2">列出仓库中所有软件包</td>
</tr>
<tr class="row-4 even">
<td class="column-1">yum info 软件包名称</td>
<td class="column-2">查看软件包信息</td>
</tr>
<tr class="row-5 odd">
<td class="column-1">yum install 软件包名称</td>
<td class="column-2">安装软件包</td>
</tr>
<tr class="row-6 even">
<td class="column-1">yum reinstall 软件包名称</td>
<td class="column-2">重新安装软件包</td>
</tr>
<tr class="row-7 odd">
<td class="column-1">yum update 软件包名称</td>
<td class="column-2">升级软件包</td>
</tr>
<tr class="row-8 even">
<td class="column-1">yum remove 软件包名称</td>
<td class="column-2">移除软件包</td>
</tr>
<tr class="row-9 odd">
<td class="column-1">yum clean all</td>
<td class="column-2">清除所有仓库缓存</td>
</tr>
<tr class="row-10 even">
<td class="column-1">yum check-update</td>
<td class="column-2">检查可更新的软件包</td>
</tr>
<tr class="row-11 odd">
<td class="column-1">yum grouplist</td>
<td class="column-2">查看系统中已经安装的软件包组</td>
</tr>
<tr class="row-12 even">
<td class="column-1">yum groupinstall 软件包组</td>
<td class="column-2">安装指定的软件包组</td>
</tr>
<tr class="row-13 odd">
<td class="column-1">yum groupremove 软件包组</td>
<td class="column-2">移除指定的软件包组</td>
</tr>
<tr class="row-14 even">
<td class="column-1">yum groupinfo 软件包组</td>
<td class="column-2">查询指定的软件包组信息</td>
</tr>
</tbody>
</table>


Linux操作系统的开机过程是这样的，即从BIOS开始，然后进入Boot Loader，再加载系统内核，然后内核进行初始化，最后启动初始化进程。初始化进程作为Linux系统的第一个进程，它需要完成Linux系统中相关的初始化工作，为用户提供合适的工作环境。红帽RHEL 7系统已经替换掉了熟悉的初始化进程服务System V init，正式采用全新的systemd初始化进程服务。

systemd初始化进程服务采用了并发启动机制，开机速度得到了不小的提升。

<table id="tablepress-45" class="tablepress tablepress-id-45">
<tbody class="row-hover">
<tr class="row-1 odd">
<td class="column-1">System V init命令（RHEL 6系统）</td>
<td class="column-2">systemctl命令（RHEL 7系统）</td>
<td class="column-3">作用</td>
</tr>
<tr class="row-2 even">
<td class="column-1">service foo start</td>
<td class="column-2">systemctl start foo.service</td>
<td class="column-3">启动服务</td>
</tr>
<tr class="row-3 odd">
<td class="column-1">service foo restart</td>
<td class="column-2">systemctl restart foo.service</td>
<td class="column-3">重启服务</td>
</tr>
<tr class="row-4 even">
<td class="column-1">service foo stop</td>
<td class="column-2">systemctl stop foo.service</td>
<td class="column-3">停止服务</td>
</tr>
<tr class="row-5 odd">
<td class="column-1">service foo reload</td>
<td class="column-2">systemctl reload foo.service</td>
<td class="column-3">重新加载配置文件（不终止服务）</td>
</tr>
<tr class="row-6 even">
<td class="column-1">service foo status</td>
<td class="column-2">systemctl status foo.service</td>
<td class="column-3">查看服务状态</td>
</tr>
</tbody>
</table>


