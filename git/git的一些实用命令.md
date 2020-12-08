# 查看代码量
```shell
git log --author="zepang" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -
```
# git status 中文乱码
```shell
git config --global core.quotepath false
```
# 由于挂代理导致的github无法访问
```shell
git config --global --unset http.proxy
```
# 删除远程分支后，branch -a还是能看到的解决方法

大家在删除远程分支后 
git branch -a 
还是可以看到已删除的远程分支，时间一长就显的非常乱了 
以下是解决方法： 
```shell
git remote show origin //可以看到删除分支情况 
```
```shell
git remote prune origin 
```
再执行 
```shell
git branch -a 
```
就可以看到已经看不见已经删除的分支了

# 给分支添加描述
```shell
git branch --edit-description
```
### 查看分支描述
```shell
git config branch.<branch name>.description
```
# 将git默认的 nano 编辑器更换成 vim
```shell
git config --global core.editor vim
```
# 获取最近一次修改的文件
```shell
git diff --name-only HEAD~ HEAD
```
# 获取两次commit修改的文件
```shell
git diff --name-only <commit-1> <commit-2>
```

# 使用git把某一次commit修改过的文件打包

使用`git log`查看提交的commit id

使用命令
```shell
git diff-tree -r --no-commit-id --name-only d18f9d5f17e190cfbb836a4acff2d96c0d466a2c | xargs tar -rf mytarfile.tar
```
把修改的文件打包

# 跟踪所有的远程分支（为所有的远程分支创建本地分支）

```shell
for i in `git branch -a | grep remote | grep -v HEAD | grep -v master`; do git branch --track ${i#remotes/origin/} $i; done
```

# 修改已经提交的所有commit的User和Email

```shell
git filter-branch --commit-filter '
        if [ "$GIT_AUTHOR_EMAIL" = "xxxx@kingsoft.com" ];
        then
                GIT_AUTHOR_NAME="xxx";
                GIT_AUTHOR_EMAIL="xxxx@gmail.com";
                git commit-tree "$@";
        else
                git commit-tree "$@";
        fi' HEAD;
```

## github release 下载文件

https://www.offcloud.com 

https://d.serctl.com/

## wsl中git出现下边错误

```bash
error: chmod on /mnt/c/projects/<repo>/.git/config.lock failed: Operation not permitted
fatal: could not set 'core.filemode' to 'false'
```

解决方法，重新挂载对应的盘

```bash
sudo umount /mnt/c
sudo mount -t drvfs C: /mnt/c -o metadata
```

## clone并切换到对应分支

```
git clone --single-branch --branch <branchname> <remote-repo> <local-dir>

git clone -b <branch> <remote_repo>
```

## 判断git repo 是否需要更新 

https://stackoverflow.com/questions/3258243/check-if-pull-needed-in-git

First use git remote update, to bring your remote refs up to date. Then you can do one of several things, such as:

首先使用 git 远程更新，使您的远程裁判更新。然后你可以做以下几件事中的一件:

git status -uno will tell you whether the branch you are tracking is ahead, behind or has diverged. If it says nothing, the local and remote are the same.

Git status-uno 将告诉您您正在跟踪的分支是在前面、后面还是已经分开。如果它什么也没说，本地和远程是一样的。

git show-branch *master will show you the commits in all of the branches whose names end in 'master' (eg master and origin/master).

Git show-branch * master 将向您显示所有以‘ master’结尾的分支中的提交(比如 master 和 origin/master)。

If you use -v with git remote update (git remote -v update) you can see which branches got updated, so you don't really need any further commands.

如果在 git 远程更新(git remote-v update)中使用-v，就可以看到哪个分支得到了更新，因此实际上不需要任何进一步的命令。

However, it looks like you want to do this in a script or program and end up with a true/false value. If so, there are ways to check the relationship between your current HEAD commit and the head of the branch you're tracking, although since there are four possible outcomes you can't reduce it to a yes/no answer. However, if you're prepared to do a pull --rebase then you can treat "local is behind" and "local has diverged" as "need to pull", and the other two as "don't need to pull".

但是，看起来您希望在脚本或程序中执行此操作，并最终得到 true/false 值。如果是这样的话，有一些方法可以检查你当前的 HEAD commit 和你追踪的分支的头之间的关系，尽管有四种可能的结果，你不能把它简化为一个是/否的回答。然而，如果你准备做一个拉—— rebase，那么你可以把“ local is behind”和“ local has diverged”看作“ need to pull” ，而把另外两个看作“ don’t need to pull”。

You can get the commit id of any ref using git rev-parse <ref>, so you can do this for master and origin/master and compare them. If they're equal, the branches are the same. If they're unequal, you want to know which is ahead of the other. Using git merge-base master origin/master will tell you the common ancestor of both branches, and if they haven't diverged this will be the same as one or the other. If you get three different ids, the branches have diverged.

您可以使用 git rev-parse < ref > 获得任何 ref 的 commit id，因此可以为 master 和 origin/master 执行此操作并比较它们。如果它们是相等的，那么分支就是相同的。如果它们是不平等的，你想知道哪一个先于另一个。使用 git merge-base master origin/master 将告诉您这两个分支的共同祖先，如果它们没有分开，那么这两个分支的祖先将是相同的。如果你得到三个不同的 id，分支就会分开。

To do this properly, eg in a script, you need to be able to refer to the current branch, and the remote branch it's tracking. The bash prompt-setting function in /etc/bash_completion.d has some useful code for getting branch names. However, you probably don't actually need to get the names. Git has some neat shorthands for referring to branches and commits (as documented in git rev-parse --help). In particular, you can use @ for the current branch (assuming you're not in a detached-head state) and @{u} for its upstream branch (eg origin/master). So git merge-base @ @{u} will return the (hash of the) commit at which the current branch and its upstream diverge and git rev-parse @ and git rev-parse @{u} will give you the hashes of the two tips. This can be summarized in the following script:

要正确地做到这一点，例如在脚本中，您需要能够引用当前分支以及它所跟踪的远程分支。/etc/bash _ completion.d 中的 bash 提示设置函数有一些获取分支名称的有用代码。然而，你可能并不真的需要得到这些名字。Git 有一些简洁的方法来引用分支和提交(如 Git rev-parse -- help 中所述)。特别是，您可以对当前分支使用@(假设您不处于分离-head 状态) ，对于其上游分支使用@{ u }(例如 origin/master)。所以 git merge-base@{ u }将返回提交的(hash of the) ，当前分支及其上游分支和 git rev-parse@和 git rev-parse@{ u }将给出这两个提示的散列。这可以在下面的脚本中总结:

```bash
#!/bin/sh

UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")

if [ $LOCAL = $REMOTE ]; then
    echo "Up-to-date"
elif [ $LOCAL = $BASE ]; then
    echo "Need to pull"
elif [ $REMOTE = $BASE ]; then
    echo "Need to push"
else
    echo "Diverged"
fi

```
Note: older versions of git didn't allow @ on its own, so you may have to use @{0} instead.

注意: 旧版本的 git 本身不允许@，所以你可能不得不使用@{0}代替。

The line UPSTREAM=${1:-'@{u}'} allows you optionally to pass an upstream branch explicitly, in case you want to check against a different remote branch than the one configured for the current branch. This would typically be of the form remotename/branchname. If no parameter is given, the value defaults to @{u}.

行 UPSTREAM = ${1:-’@{ u }}允许显式地传递上游分支，以防您想检查与当前分支配置的分支不同的远程分支。这通常是 remotename/branchname 形式的。如果没有给出参数，则该值默认为@{ u }。

The script assumes that you've done a git fetch or git remote update first, to bring the tracking branches up to date. I didn't build this into the script because it's more flexible to be able to do the fetching and the comparing as separate operations, for example if you want to compare without fetching because you already fetched recently.

该脚本假设您已经先执行了 git 提取或 git 远程更新，以使跟踪分支更新。我没有在脚本中构建这个代码，因为它更灵活，可以作为单独的操作执行获取和比较，例如，如果您想比较而不想获取，因为您最近已经获取了。

