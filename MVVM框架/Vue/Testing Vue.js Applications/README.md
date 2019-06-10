# Jest

```shell
npm install --save-dev jest
```

```json
// package.json

{
  "scripts": {
    "test: unit": "jest"
  }
}
```

if you're using windows, you should add `--no-cache` flag to the `jest` command to avoid potential errors.

```json
// package.json

{
  "scripts": {
    "test: unit": "jest --no-cache"
  }
}
```

当我们是在根目录下运行下面的命令：
```shell
npm run test:unit
```
我们发现出现下边的错误：
```shell
testMatch: **/__tests__/**/*.[jt]s?(x), **/?(*.)+(spec|test).[tj]s?(x) - 0 matches
```
没有匹配到任何测试文件。

jest使用glob来匹配它的测试文件，通常这些文件在`__tests__`文件夹下，并以`.spec.js`或者`.test.js`结尾。关于glob更多的内容查看[https://www.npmjs.com/package/glob#glob-primer](https://www.npmjs.com/package/glob#glob-primer)

我们在`/src/components`目录下创建`__test__`文件夹，尽量将单元测试的代码放在靠近需要测试的代码是一个比较好的习惯。

使用jest申明单元测试，需要用到`test`函数，这个函数接受两个参数，第一个是用来这个单元测试的名字的字符串，另一个是参数是一个包含测试代码的函数。

```js
test('sanity test', () => {
  return
})
```

非常基本的几个函数：
* test
* assert
* describe





