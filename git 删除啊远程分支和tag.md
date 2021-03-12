git 删除远端分支，一般使用方法

```
git push origin :branchName
git push origin -d branchName
```

git 删除远端tag，一般使用

```
git push origin tag -d tagName
```

当远端branch和tag是同一个名字的时候，使用上面方法删除分支，就会出现

```
error: dst refspec xxxx(branchName) matches more than one
``

这个使用可以使用下面方法删除分支和标签

```
git push origin :refs/heads/branchName    //删除远端branch
git push origin :refs/tags/tagName        //删除远端tag
```