# 查找已创建，删除，修改文件

```
git log --diff-filter=A --summary | grep {create|modify|delete}
```

# 查找相关文件修改的commit

```
git log -- {filepath}
```