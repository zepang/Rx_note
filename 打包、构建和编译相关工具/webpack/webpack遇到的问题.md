# 使用webpack遇到的问题

问题：在`wsl`环境下打包发现打包卡住问题？

解决：将`uglifyJS`的`parallel: true`置为 `parallel: false`