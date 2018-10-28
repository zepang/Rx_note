### 由于不可说原因，npm install时，速度总是不尽如人意，解决办法是修改npm的数据源
~~~shell
npm config set registry https://registry.npm.taobao.org
~~~
### 修改后可以通过这个进行测试
~~~shell
npm config get registry
~~~