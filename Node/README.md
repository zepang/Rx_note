### node.js 中获取文件列表，获取文件名，获取后缀名

```js
const {resolve,extname,basename} = require('path')
const glob = require('glob')

glob.sync(resolve(__dirname, './api_module', '**/*.js')) // 遍历该目录底下的所有文件
.forEach((file)=>{
  var extension = extname(file); //  获取后缀名
  var fileName = basename(file,extension); // 获取没有后缀的文件名
  console.log(extension,fileName)
})
```