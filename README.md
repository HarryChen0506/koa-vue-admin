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
### 后端服务server
1. 项目构建流程
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
2. 配置eslint
```
// 参考 https://www.cnblogs.com/linx/p/7122560.html
// 本地安装eslint
$ npm install eslint --save-dev
// 初始化
$ ./node_modules/.bin/eslint --init
  ❯ Answer questions about your style
  Use a popular style guide
  Inspect your JavaScript file(s)
// 选择standard JSON
// 在根目录下新建配置文件
.eslintrc
{
  "extends": "standard",
	"plugins": [
		"standard",
		"promise"
	],
	"rules": { 
		"semi": 0,        
		"quotes": [
			"error",
			"single"
		],
		"indent": ["error", 2]
	}
}

```
### admin前端
1. 项目构建流程
```
// 安装vue-cli 3.0
$ npm install -g @vue/cli
// 初始化项目
$ vue create admin // admin 项目名
// 开发
$ npm run dev
// build
$ npm run build
```
```
2. vue-cli 配置

```
命令：vue-cli-service serve
Usage: vue-cli-service serve [options]
Options:
  --open    服务器启动时打开浏览器
  --copy    将URL复制到服务器启动时的剪贴板 (直接到浏览器去粘贴就OK了 http://localhost:8080/)
  --mode    指定环境模式 (默认: development)
  --host    host 地址 (default: 0.0.0.0)
  --port    端口号 (default: 8080)
  --https   使用https (default: false)
	
命令：vue-cli-service build
Usage: vue-cli-service build [options] [entry|pattern]
Options:
  --mode        指定环境模式 (default: production)
  --dest        指定输出目录 (default: dist)
  --modern      构建两个版本的 js 包：一个面向支持现代浏览器的原生 ES2015+ 包，以及一个针对其他旧浏览器的包。
  --target      允许您以项目库或Web组件的形式在项目内部构建任何组件 app | lib | wc | wc-async (default: app) ???
  --name        lib或者web组件库的名称 (default: "name" in package.json or entry filename)
  --no-clean    在构建项目之前不要删除输出目录(dist)
  --report      生成report.html以帮助分析包内容
  --report-json 生成report.json来帮助分析包内容
  --watch       监听 - 当有改变时 自动重新打包~

```

## 心得
1. koa-router
  - koa-router支持中间件串联，因此可以通过加入jwt中间件来控制路由访问权限，达到鉴权的目的，具有很好的插拔扩展性
2. 封装日志
	- 基于log4js进行日志中间件设计，参考https://cloud.tencent.com/developer/article/1079645
	- 根据日志功能进行区分，如api和db的日志，分别录入相应的日期文件
	- 开发环境日志存放在项目根目录下的logs，生产环境日志存放在服务器根目录的某个文件下的logs