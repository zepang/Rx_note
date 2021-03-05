#1.npm 官网注册账号

https://www.npmjs.com/

#2.npm init 

生成package.json，如果已存在，就不用

#3.npm adduser （添加用户）

Username:

Password:

Email:

#3.npm login（您在npm官网注册的账号，密码，邮箱）

#4.npm whoami  （查看是否登录成功，成功后返回账户名）

#5.npm publish [floder] //不带参数默认是当前目录

#6.管理包权限

查看模块拥有者

$ npm owner ls

$ npm owner ls hello_freedom

添加一个发布者

$ npm owner add

$ npm owner add freedom hello_freedom

删除一个发布者

$ npm owner rm

$ npm owner rmfreedom hello_freedom

#8.分析包

查看当前项目引入了哪些包

npm ls

#9.更新自己发布的np包

1.修改包的版本（package.json里的version字段）

2.npm publish

npm version patch && git push --follow-tags && npm publish

npm version minor && git push --follow-tags && npm publish

npm version major && git push --follow-tags && npm publish

常见错误

1.package.json中的name不能大写

2.auth required for publishing

解决方案：没有登录成功，需要登录

3.no_perms Private mode enable, only admin can publish this module（重新设置npm镜像）

解决方案：npm config set registry=http://registry.npmjs.org

4.发布的npm包不能与现有的npm包类库名重名

解决办法：到npm官网查询一下你现在的包名是否有重名
