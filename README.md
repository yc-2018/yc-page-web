# 欢迎来到仰晨主页
## 1. 项目简介
这算是毕设项目，也是我本来想做的一个项目。只是我没想到我会用react来写这个项目。
因为有这个想法的时候,我还不会写react,也不会写vue,只是刚好进了公司要求学了react,于是就顺便开始写了这个项目。又顺便用来当毕设.
这个项目只要是用来当浏览器主页导航的还有写备忘/待办事项的,登录要通过微信订阅号来实现,后面还会有个人博客和一些其他的东西.

## 2.项目说明
### 2. 项目主要结构
```text
.                                                                                                                                                                                                                
├── public : 静态文件  
├── src : 项目源码
│   ├── components : 各种自定义小组件
│   ├── pages : 页面
│   │   ├── Home : 导航页组件(包括书签组件和搜索组件)
│   │   ├── Help : 帮助页组件
│   │   ├── Blog : 博客页组件
│   │   ├── Head : 头部栏组件
│   │   ├── UtilsPage : 各种小工具组件
│   │   ├── Mobile : 移动端组件
│   │   ├── MemoDrawer : 备忘录组件
│   │   └── EnglishDrawer : 备忘英语组件
│   ├── routes : 路由
│   ├── store : 状态管理 和 一些静态数据
│   ├── utils : 工具类   
│   ├── request : 请求整合在此
│   ├── App.js :  程序入口--路由跳转、公共页面
│   ├── index.js : 项目入口--路由配置、国际化
│   └── setupProxy.js : 调试模式下的代理 实际部署这个没用得用Nginx
├── package.json : 包管理文件
└── yarn.lock : 项目使用yarn管理依赖  
```
## 2.2 分支说明
gitee:
- master: 主分支
- build: 项目打包直接部署在gitee分支（由GitHub Action强制推送）(hash路由版)
- ~~main: GitHub分支备份~~
- ~~gitee-build: GitHub分支备份~~

github:
- main: 推送时触发GitHub Action自动打包到build分支
- build: 由GitHub Action自动生成的打包文件（强制推送）(BrowserRouter路由版)
- gitee-build:推送时触发GitHub Action自动打包强制推送到gitee的build分支

## 3. 项目运行
依赖安装
`yarn install`

运行项目
`yarn start`

项目很多数据都是通过后端项目来获取的,所以项目需要配合后端项目一起使用,[后端项目在这里](https://gitee.com/yc556/yc-page).
