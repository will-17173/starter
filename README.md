# 一个项目模板
一个Webpack + ES6 + SASS + MOCKJS的多页面项目模板  
src目录下面的每个[name].html文件对应src/js/下面的入口文件[name].entry.js  
静态资源目录assets里的不会被webpack编译  
默认打包后支持IE8

## 目录结构
```bash
├── assets # 静态资源
├── src # 开发目录
│   ├── img # 图片
│   └── js # 脚本
│        └── index.entry.js
│   └── scss # SCSS
│   └── index.html # 页面
└── mock # mock接口
```

## MOCK
mock使用mockjs-webpack-plugin，访问`http://localhost:8888/`区得全部接口  
通过`/api/..`访问