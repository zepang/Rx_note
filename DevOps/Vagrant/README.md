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