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
        if [ "$GIT_AUTHOR_EMAIL" = "laizehai@tulong.com" ];
        then
                GIT_AUTHOR_NAME="zepang";
                GIT_AUTHOR_EMAIL="ummlq4@gmail.com";
                git commit-tree "$@";
        else
                git commit-tree "$@";
        fi' HEAD;
```