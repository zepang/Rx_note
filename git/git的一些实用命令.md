# 查看代码量

git log --author="zepang" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -

# git status 中文乱码

git config --global core.quotepath false

# 由于挂代理导致的github无法访问

git config --global --unset http.proxy

# 删除远程分支后，branch -a还是能看到的解决方法

大家在删除远程分支后 
git branch -a 
还是可以看到已删除的远程分支，时间一长就显的非常乱了 
以下是解决方法： 
git remote show origin //可以看到删除分支情况 
git remote prune origin 
再执行 
git branch -a 
就可以看到已经看不见已经删除的分支了

# 给分支添加描述

git branch --edit-description

### 查看分支描述

git config branch.<branch name>.description

# 将git默认的 nano 编辑器更换成 vim

git config --global core.editor vim
