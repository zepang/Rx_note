# Intall VirtualBox and Vagrant

* [VirtualBox Website](https://www.virtualbox.org/)
* [Vagrant Website](https://www.vagrantup.com)

#### 验证vagrant是否安装成功

```bash
vagrant -v
# Vagrant 2.2.1
```

# Vagrant Command-Line

Vagrant 主要是一个命令行工具。虽然可以找到第三方的用户界面，但是Vagrant本身不提供。Vagrant提供了超过25个命令和子命令。

we can run the `vagrant --help` command to show the list of commands with terminal.

```bash
vagrant --help

Usage: vagrant [options] <command> [<args>]

    -v, --version                    Print the version and exit.
    -h, --help                       Print this help.

Common commands:
     box             manages boxes: installation, removal, etc.
     cloud           manages everything related to Vagrant Cloud
     destroy         stops and deletes all traces of the vagrant machine
     global-status   outputs status Vagrant environments for this user
     halt            stops the vagrant machine
     help            shows the help for a subcommand
     init            initializes a new Vagrant environment by creating a Vagrantfile
     login
     package         packages a running vagrant environment into a box
     plugin          manages plugins: install, uninstall, update, etc.
     port            displays information about guest port mappings
     powershell      connects to machine via powershell remoting
     provision       provisions the vagrant machine
     push            deploys code in this environment to a configured destination
     rdp             connects to machine via RDP
     reload          restarts vagrant machine, loads new Vagrantfile configuration
     resume          resume a suspended vagrant machine
     snapshot        manages snapshots: saving, restoring, etc.
     ssh             connects to machine via SSH
     ssh-config      outputs OpenSSH valid configuration to connect to the machine
     status          outputs status of the vagrant machine
     suspend         suspends the machine
     up              starts and provisions the vagrant environment
     upload          upload to machine via communicator
     validate        validates the Vagrantfile
     version         prints current and latest Vagrant version
     winrm           executes commands on a machine via WinRM
     winrm-config    outputs WinRM configuration to connect to the machine

For help on any individual command run `vagrant COMMAND -h`

Additional subcommands are available, but are either more advanced
or not commonly used. To see all subcommands, run the command
`vagrant list-commands`.
```

If you want to see more infomation on a specific command, add the ` --help `flag to the end of the command which you want to learn.

```bash
vagrant box --help
==> vagrant: A new version of Vagrant is available: 2.2.4 (installed version: 2.2.1)!
==> vagrant: To upgrade visit: https://www.vagrantup.com/downloads.html

Usage: vagrant box <subcommand> [<args>]

Available subcommands:
     add
     list
     outdated
     prune
     remove
     repackage
     update

For help on any individual subcommand run `vagrant box <subcommand> -h`

```

```bash
vagrant box add --help
Usage: vagrant box add [options] <name, url, or path>

Options:

    -c, --clean                      Clean any temporary download files
    -f, --force                      Overwrite an existing box if it exists
        --insecure                   Do not validate SSL certificates
        --cacert FILE                CA certificate for SSL download
        --capath DIR                 CA certificate directory for SSL download
        --cert FILE                  A client SSL cert, if needed
        --location-trusted           Trust 'Location' header from HTTP redirects and use the same credentials for subsequent urls as for the initial one
        --provider PROVIDER          Provider the box should satisfy
        --box-version VERSION        Constrain version of the added box

The box descriptor can be the name of a box on HashiCorp's Vagrant Cloud,
or a URL, or a local .box file, or a local .json file containing
the catalog metadata.

The options below only apply if you're adding a box file directly,
and not using a Vagrant server or a box structured like 'user/box':

        --checksum CHECKSUM          Checksum for the box
        --checksum-type TYPE         Checksum type (md5, sha1, sha256)
        --name BOX                   Name of the box
    -h, --help                       Print this help

```

## 基本的命令

* list-command
  
  列出vagrant可用的命令

* help
  
  上边已经说过了

* version
* global-status
  
  列出当前用户所有的vagrant环境的信息

## 配置命令

* login
  
  用来登录[https://www.hashicorp.com/](https://www.hashicorp.com/)这个网站的账号，一般不用
* package
  
  用来创建vagrant box

* snapshot
  
  The  snapshot command allows you to manage snapshots of Vagrant
environments. You can save, delete, and restore snapshots. Only certain
providers support snapshotting If your provider does not, Vagrant will return
a warning when this command is run.

剩下一些命令具体使用可以查看文档。接下来说一下日常用到的命令

## 日常使用命令

* box
  
  box command allow you manage you Vagrant boxes on your system.You can install, update, remove and prun boxes.

* destroy

  The  destroy command will stop and delete a Vagrant machine.

* halt

  The  halt command will stop/halt a running Vagrant machine.

* init 

  The  init command generates a new Vagrantfile, which is used to configure
new Vagrant environments.

* port 
  
  The  init command generates a new Vagrantfile, which is used to configure
new Vagrant environments.

* reload

  The  reload command is used when you make a change to the Vagrantfile and
wish to apply that to the running machine. This command will stop, apply the
new Vagrantfile, and start up the environment.

* resume 
  
  The  resume command will start up a paused Vagrant environment. It can be
used after the  vagrant halt command.

* status

  The  status command will return the status of a Vagrant machine. It will return
information such as  stopped or  running 

* suspend

  The  suspend command is similar to the  vagrant halt command, but instead of
completely stopping and shutting down the machine, it will save the state this
uses extra disk space on your guest machine, but when you start the machine
back up again, it will start quickly and from that exact point. There will be no
lengthy boot-up process as if you were starting it from cold.

* up

  The  up command will start up a Vagrant environment. During the start
process, it will also provision the machine, similarly to the  vagrant provision
command.

* validate

  The  validate command will validate a Vagrantfile and return any errors. It
checks for issues within the Vagrantfile, such as incorrect syntax.

## 特定于应用程序的命令

* ssh
  
  The  ssh command will connect you to a remote Vagrant machine using the
SSH protocol/connection. This command gives you access to the machine's
shell, which allows you to run commands directly on the machine.

# Discovering Vagrant Boxes

## Understanding Vagtant boxes

A Vagrant box is a specific package format for containing Vagrant environments.
A Vagrant box file use `.box` file extension.A Vagrant box
can be used with any platform and system that Vagrant supports to create the
same environment by following the steps in the box file.

## Vagrant box file anatomy

A Vagrant box file is made up of three components:

  * box file

  The box contains different information depending on the provider. It is
provider-specific and could be in several different formats, such as ZIP,
tar.gz , or TAR. This information is not used by Vagrant but is instead passed
on to the provider.

  * box metadata

    The box catalog metadata is generally used with the Vagrant cloud platform.
It contains information such as the box name, different versions, descriptions
and different supported providers, and any URLs to specific box files. This
metadata is usually stored as a JSON document. The filename would be
metadata.json .

  * box infomation
    The box information is the extra details that you can add. These extra details
are displayed when a user runs the  vagrant box list --box-info command. You
can set information for the author name/company and a URL. This file is a
JSON document and the filename would be  info.json .


## How to install a Vagrant box

* A URL that point directly to the box file

```bash
 vagrant box add debian/jessie64 
```

* A shorthand/alias for the public box name, such as `debian/jessie64`

```bash
  vagrant box add --name "mybox" http://www.example.com/boxname.box 
```

* A file path or URL to a box in a specific catalog

```bash
   vagrant box add https://app.vagrantup.com/ubuntu/boxes/trusty64 
```

# Installing a Vagrant box found on the Vagrant Cloud

[Vagrant cloud website: https://app.vagrantup.com/boxes/search](https://app.vagrantup.com/boxes/search)

# Uploading a Vagrant box to the Vagrant cloud

First, if we want to upload own Vagrant box to the Vagrant cloud, we must to create a account with the Vagrant cloud platform.[Click here for registe](https://app.vagrantup.com/account/new)

Second, we can create a Vagrant box follow the steps:

1. Add a box from cloud

```bash
  vagrant box add centos/7
```

2. Make sure the box working correctly.
  
```bash
  vagrant init centos/7
  vagrant up
  vagrant ssh
```
确认box是可以用的之后，退出并关掉 machine

```bash
exit
vagrant halt
```

3. 打包环境成box文件
   
```bash
vagrant package --output work-centos7.box
```

4. 通过第三步我们可以得到一个`work-centos7.box`的文件

之后我们可以在 [https://app.vagrantup.com/](https://app.vagrantup.com/)创建一个box，这一步的步骤比较简单。
创建完成之后会让你上传文件，只需要将刚才的`.box`文件上传就好

5. 上传完成之后，我们就可以在[https://app.vagrantup.com/boxes/search](https://app.vagrantup.com/boxes/search)上边搜索到我们的box，以后我们也可以通过上边的步骤使用我们的box。

# 使用 Vagrantfile 来配置 Vagrant

当我们使用 `vagrant init`，vagrant会在当前 project 根目录下生成一个名为 `Vagrantfile` 的文件。如果你只需要一个最小的或者最基本的shell环境，可以使用`vagrant init -m` 或者 `vagrant init -minimal`
来初始化vagrant的项目，`Vagrantfile`会包含下边的配置：

```bash
Vagrant.configure("2") do |config|
  config.vm.box = "base"
end
```

`vagrant up `命令就是通过这个配置文件来拉取依赖和启动 vagrant 环境。

## Vagrantfile 配置选项


### Vagrant machine 的配置（config.vm）

Vagrant machine的配置全部是在 config.vm 这个命名空间下

具体的还是查看官网的文档[https://www.vagrantup.com/docs/vagrantfile/machine_settings.html](https://www.vagrantup.com/docs/vagrantfile/machine_settings.html)

### Vagrant SSH 配置选项

文档[https://www.vagrantup.com/docs/vagrantfile/ssh_settings.html](https://www.vagrantup.com/docs/vagrantfile/ssh_settings.html)

此外还有 config.winrm config.winssh config.vagrant，详情还是查看官方的文档吧[https://www.vagrantup.com/docs/vagrantfile/](https://www.vagrantup.com/docs/vagrantfile/)

# Vagrant 网络配置(networking)

Vagrant 的网路有3种类型：

* Port-forwarding
* Private networking
* Public networking

## Port-forwarding

客户机和vagrant环境的端口映射

```yaml
config.vm.network "forwarded_port", guest: 80, host: 8080
```

也就是说访问本地的8080端口可以访问对应的vagrant环境的80端口

## Private networking

私有网络配置，可以通过局域网来访问vagrant环境。

```yaml
config.vm.network "private_network", type: "dhcp"
```

通过`vagrant ssh`进行shell环境，由于我们使用的是`dhcp`, 还需要输入 `ifconfig` 查看网卡动态分配的ip。

我们也可以通过下边的配置来分配一个静态ip：

```yaml
config.vm.network "private_network", ip: "10.10.10.10"
```

## Public networking共有网络

基本的使用方法和私有网络是一样的。

### 桥接

当我们选择 `public_network`的网络方式启动时，终端会让我们选择使用哪种桥接方式。如果想要避免这一步，我们可以按照如下配置，指定一种桥接方式：

```yaml
config.vm.network "public_network", bridge: "en0: Wi-Fi (AirPort)" 
```

