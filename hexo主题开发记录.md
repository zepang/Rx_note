# hexo 主题开发记录

想要开发一个hexo主题的主要原因就是希望主题这方面的设计能尽量的满足个人的想法。

# 搭建主题开发的环境

安装 `hexo-cli`

```bash
npm install hexo-cli -g
```

通常一个 hexo 主题的文件目录是是固定的，我们使用 `generator-hexo-theme` 这个脚手架生成基本的主题目录

```bash
npm install -g yo
npm install -g generator-hexo-theme
```

接下来我们使用使用 hexo-cli 初始化一个 hexo 博客，并进入`themes` 目录，我们可以看到生成的项目中自带了一个`landscape`主题

```bash
hexo init blog-site
cd blog-site/themes
```

接下来创建要开发的 `theme` 目录，并使用脚手架创建文件结构

```bash
mkdir minimalism
cd minimalism/
yo hexo-theme

tree

.
├── _config.yml # 主题配置文件
├── layout # 布局文件
│   ├── archive.ejs # 归档页面
│   ├── category.ejs # 分类页面
│   ├── index.ejs # 主页
│   ├── layout.ejs # 页面布局
│   ├── page.ejs # 详情页面
│   ├── partials 
│   │   └── recent-posts.ejs # 文章列表模板
│   ├── post.ejs # 文章页面
│   └── tag.ejs # 标签页面
├── package.json
├── scripts
│   └── readme.md
└── source # 资源文件夹
    ├── css
    │   └── minimalism.scss
    ├── favicon.ico # 站点图标
    └── js
        └── minimalism.js
```

在项目跑起来之前，我们还需要将blog的主题设置成我们刚才创建主题，找到 `themes/_config.yml`，将 `theme: lanscape` 更换成 `theme: paper`，之后我们通过 `hexo s` 启动 hexo blog，通过浏览器访问我们可以看到一个包含一篇"hello world"的文章并且没有任何`css`的 blog 首页。

为了方便主题的开发，我们安装`hexo-browsersync`，在开发模式下，对应文件的修改，将会使得页面重新刷新。

```shell
npm install hexo-browsersync --save-dev
```

# 页面开发

首先了解的是`layout`这个文件夹的文件，`layout.ejs`放着整个网站布局的核心代码。

目前的一个页面一个大体的布局自上而下是头部，导航，主体（分为主要部分和侧边栏部分），底部。我们