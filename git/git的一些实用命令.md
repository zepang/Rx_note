# 查看代码量

git log --author="zepang" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -

# git status 中文乱码

git config --global core.quotepath false

# 由于挂代理导致的github无法访问

git config --global --unset http.proxy


