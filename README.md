# koa-vue-admin
admin system

## 项目说明
1. 后端服务 server
  - 使用koa2作为后端服务
  - 使用jwt token作为用户鉴权
  - 使用mongodb作为数据库
2. 管理后台 admin
  - 使用vue全家桶作为前端框架
  - 使用第三方element-ui库
3. 客户端
  - 前期使用vue全家桶，后期考虑ssr再重构

## 项目启动和部署
1. 后端服务 server
```
// 启动
$ cd server
$ npm install
$ npm run dev
// 部署
// 将除node_modules文件夹外的文件拷贝到服务器
$ npm install
$ pm2 start ./index.js
```

## 项目记录
1. 后端服务 server
```
// 安装koa脚手架，支持koa和koa2
$ npm install -g koa-generator
// 初始化项目
$ koa2 ./server -e --ejs
$ cd ./server
$ npm install
// 启动
$ npm run dev
// 部署
// 将项目文件拷贝到服务器（除node_modules文件夹）
$ npm run prd
```

## 心得
1. koa-router
  - koa-router支持中间件串联，因此可以通过加入jwt中间件来控制路由访问权限，达到鉴权的目的，具有很好的插拔扩展性