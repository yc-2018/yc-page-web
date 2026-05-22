# 欢迎来到仰晨主页

## 1. 项目简介

这算是毕设项目，也是我本来想做的一个项目。只是我没想到我会用react来写这个项目。
因为有这个想法的时候,我还不会写react,也不会写vue,只是刚好进了公司要求学了react,于是就顺便开始写了这个项目。又顺便用来当毕设.
这个项目只要是用来当浏览器主页导航的还有写备忘/待办事项的,登录要通过微信订阅号来实现,后面还会有个人博客和一些其他的东西.

`yc-web` 是一个面向个人使用的浏览器主页与备忘工具前端。桌面端以导航主页为第一屏，提供搜索引擎、快捷链接、书签组、背景图、备忘抽屉、英语备忘、博客和远程工具箱入口；移动端则切换为备忘优先的 `antd-mobile` 体验，并保留博客与个人中心。

登录依赖微信公众号验证码。登录后，搜索配置、快捷链接、书签、背景图、备忘内容、英语词条、观看时间统计等数据会通过后端接口同步；部分首页配置会按用户 ID 写入 `localStorage` 作为本地缓存。

## 2. 项目说明

### 2.1 项目环境

- webStorm:
  - Lingma                  : AI辅助
  - Translation             : 翻译
  - CharAutoReplace         : 符号替换
  - Rainbow Brackets Lite   : 括号高亮
- Node.js：建议 `>=20.18.3`
- Yarn：项目声明 `packageManager` 为 `yarn@1.22.22`

### 2.2 技术栈

- 构建工具：Vite 7
- UI 框架：React 18、React Router 6
- 语言：TypeScript、TSX、JavaScript、JSX 混用
- UI 组件：Ant Design 6、Ant Design Mobile 5
- 状态管理：MobX、mobx-react-lite
- 请求：axios、fetch-jsonp
- 拖拽：`@dnd-kit/core`、`@dnd-kit/sortable`
- Markdown：markdown-to-jsx、react-syntax-highlighter、react-copy-to-clipboard
- 日期：dayjs
- 图片：browser-image-compression

### 2.3 项目主要结构

```text
.
├── public/                      静态资源、默认壁纸、favicon、微信公众号二维码
├── src/
│   ├── App.tsx                  应用壳、路由渲染、桌面端公共弹窗与抽屉挂载
│   ├── main.tsx                 React 入口、Ant Design 中文配置、BrowserRouter
│   ├── routes/                  桌面端与移动端路由切换
│   ├── request/                 后端、博客、工具、观看时间等请求封装
│   ├── store/                   MobX Store 与默认数据
│   ├── interface/               TypeScript 数据结构定义
│   ├── utils/                   JWT、日期、本地存储、URL、图片压缩等工具
│   ├── components/              通用组件：拖拽、右键菜单、Markdown、图标回退等
│   └── pages/
│       ├── Home/                桌面首页、搜索、快捷链接、书签
│       ├── MemoDrawer/          桌面备忘录抽屉
│       ├── EnglishDrawer/       桌面英语备忘抽屉
│       ├── Mobile/              移动端登录、备忘、博客、个人中心
│       ├── Blog/                桌面博客页
│       ├── Help/                帮助页
│       ├── Head/                桌面头部导航
│       └── SeeTime/             观看时间记录与图表
├── vite.config.ts               Vite 别名、代理配置
├── eslint.config.js             ESLint 配置
├── tsconfig*.json               TypeScript 配置
├── package.json                 包管理文件
├── yarn.lock                    项目使用 Yarn 管理依赖
└── .github/workflows/main.yml   main 分支自动构建与部署流程
```

### 2.4 分支说明

gitee:

- main: 主分支
- build: 项目打包直接部署在gitee分支（由GitHub Action强制推送）(hash路由版)
- ~~gitee-build: GitHub分支备份~~

github:

- main: 推送时触发GitHub Action自动打包到build分支
- build: 由GitHub Action自动生成的打包文件（强制推送）(BrowserRouter路由版)
- gitee-build:推送时触发GitHub Action自动打包强制推送到gitee的build分支

## 3. 项目运行

依赖安装

`yarn install`

运行项目

`yarn dev`

常用命令：

```bash
yarn install
yarn dev
yarn build
yarn lint
yarn preview
```

说明：`yarn lint` 当前 ESLint 配置主要检查 `ts`、`tsx` 文件；项目中仍存在大量 `js`、`jsx` 文件。

项目很多数据都是通过后端项目来获取的,所以项目需要配合后端项目一起使用,[后端项目在这里](https://gitee.com/yc556/yc-page).

已验证链接记录：

- [后端项目](https://gitee.com/yc556/yc-page)：2026-05-06 验证返回 200。
- `https://yc556.cn`：2026-05-06 验证返回 200。代码中的 `/api` 是接口前缀，不是普通页面。
- `https://bk.yc556.cn`：2026-05-06 验证返回 200。
- `https://gj.yc556.cn`：2026-05-06 验证返回 200。

## 4. 应用启动与路由

`src/main.tsx` 使用 `ConfigProvider` 配置 Ant Design 中文语言包和消息层级，然后挂载 `BrowserRouter` 与 `App`。

`src/App.tsx` 通过 `useRoutes(routes)` 渲染路由，并根据路由标题更新 `document.title`。桌面端会懒加载头部导航、登录弹窗、个人信息弹窗、备忘抽屉和英语抽屉；移动端不显示这些桌面公共组件。

`src/routes/index.tsx` 使用 `isMobile()` 判断路由表。当前移动端判断逻辑是 `window.innerHeight > window.innerWidth`，移动端使用 `Mobile` 作为底部导航布局，并拆成 `/` 待办、`/blog` 博客、`/me` 个人中心等子路由；桌面端包含首页、帮助、博客、观看时间和 404。

## 5. 请求与数据来源

主要请求封装集中在 `src/request`：

- `myAxios.ts`：后端接口 axios 实例，代码中的基础前缀为 `https://yc556.cn/api`；请求拦截器会读取 JWT 并在未过期时添加 `Authorization: Bearer <token>`。
- `commonRequest.js`：微信公众号验证码登录、用户昵称和头像更新。
- `homeApi.ts`：背景图、用户配置、搜索引擎、快捷链接、书签相关接口。
- `memoApi.ts`：备忘列表、增删改、循环备忘子项相关接口。
- `blogRequest.js`：博客菜单、Markdown、图标映射读取。
- `toolsRequest.ts`：工具列表与图片上传。
- `otherRequest.ts`：观看时间保存与查询。

## 6. 状态管理与本地缓存

项目使用少量 MobX Store：

- `CommonStore`：全屏加载状态与全局消息实例。
- `UserStore`：JWT、登录弹窗、个人信息弹窗；清除 JWT 时也会删除背景缓存。
- `ShowOrNot`：桌面备忘抽屉、英语抽屉显示状态。
- `SearchStore`：当前搜索引擎名称，主要依赖 `localStorage`。

`src/utils/localStorageUtils.ts` 会把大部分本地缓存键加上当前用户 ID 后缀，例如默认搜索引擎、背景图、头像昵称、搜索引擎列表和首页链接列表。未登录时用户 ID 会落到 `noLogin`。

## 7. 核心业务

### 7.1 首页

桌面首页位于 `src/pages/Home`，主要能力包括：

- 背景图：默认壁纸、本地缓存、云端配置、Bing 随机图、风景图、漫画图、自定义图片链接、下载当前背景。
- 搜索：常用和不常用搜索引擎、右键编辑/删除/排序、设置主搜索、百度联想词、`@@@` 作为搜索词占位符。
- 首页快捷链接：登录后可添加、编辑、删除、拖拽排序，图标通过显式 `iconUrl` 或 favicon 回退策略显示。
- 书签组：登录后按组展示书签，支持右键编辑/删除和拖拽排序。
- 工具入口：远程工具箱、博客、帮助页、备忘抽屉、英语抽屉。
- 用户入口：登录、修改头像昵称、退出登录。

### 7.2 备忘

备忘类型定义主要在 `src/store/NoLoginData.tsx` 与接口 `IMemo.ts` 中体现：

| 类型值 | 含义 |
| --- | --- |
| `0` | 普通 |
| `1` | 循环 |
| `2` | 长期 |
| `3` | 紧急 |
| `4` | 备忘英语 |
| `5` | 日记 |
| `6` | 工作 |
| `7` | 其他 |

桌面端备忘在 `src/pages/MemoDrawer`，移动端备忘在 `src/pages/Mobile/Memo.jsx`。两端共用 `memoApi.ts`，都支持新增、编辑、完成/取消完成、删除、筛选完成状态、排序、搜索、循环备忘加一、完成备注和时间补录。桌面端额外提供日期范围筛选、批量展开/收起文本；移动端提供滑动操作、下拉刷新、无限滚动、图片上传和循环子项图片预览。

循环备忘子项由 `loopMemoItem` 接口族维护，可记录循环日期、备注和图片列表。移动端上传图片时会先走 `compressImageToXMB`，再调用工具请求上传。

### 7.3 英语备忘

英语备忘抽屉位于 `src/pages/EnglishDrawer`，本质上复用备忘类型 `4`。内容格式为 `英文@@@中文`，支持按首字母筛选、排序、搜索、新增、编辑和删除。

### 7.4 博客

博客页从 `https://bk.yc556.cn` 拉取菜单、图标映射和 Markdown 内容。桌面端是左侧菜单加右侧 Markdown 渲染，移动端博客无需登录，可通过 `/blog?item=...` 打开并定位到与桌面端一致的文章。

Markdown 渲染组件 `src/components/Md` 使用 `markdown-to-jsx`，为代码块添加语法高亮、语言标题和复制按钮，同时覆盖表格、引用、键盘键、链接等基础样式。

### 7.5 观看时间

`src/pages/SeeTime` 用于读取 URL 参数中的观看记录，写入本地 `localStorage`，登录后同步到云端。图表页 `SeeTimeChart` 支持日、周、月、年切换：

- 日视图：展示每次打开时间和实际观看时间的横向条。
- 周/月/年视图：按日或月聚合成柱状图，可点击柱子下钻到更小粒度。

### 7.6 工具箱

工具入口通过 `src/request/toolsRequest.ts` 读取远程工具列表，桌面首页和头部导航都会按接口数据动态渲染外链工具。

## 8. 开发风格

- 编码：项目 `.editorconfig` 指定 UTF-8、LF、2 空格缩进。
- 路径别名：`@/*` 指向 `src/*`。
- 组件：函数组件为主，桌面端大量使用 Ant Design，移动端使用 Ant Design Mobile。
- 状态：共享状态优先放到 MobX Store；页面内部状态用 React Hooks；部分历史代码使用模块级变量驱动刷新。
- 请求：登录态后端请求优先走 `myAxios` 或 `myGet`、`myPost`、`myPut`、`myDelete`。
- 交互：右键菜单、拖拽排序、弹窗确认、抽屉展示是项目常见模式，新增功能应优先复用现有组件。
- 注释：现有代码偏好中文注释，类、方法和复杂逻辑通常写块注释或 JSDoc。

## 9. 构建与部署

`main` 分支推送会触发 `.github/workflows/main.yml`：

1. 拉取代码。
2. 设置 Node 20 与 Yarn 缓存。
3. 执行 `yarn install --frozen-lockfile`。
4. 执行 `yarn run build`。
5. 将 `dist` 内容强制推送到 `build` 分支。
6. 请求服务器更新脚本。
7. 构建成功后发送邮件通知。

## 10. 维护注意事项

- 不要把 `dist`、`node_modules` 当作源码修改目标。
- 修改桌面端备忘时，通常需要检查移动端备忘是否也要同步行为。
- 修改备忘类型、排序参数、分页参数时，需要同时检查 `memoApi.ts`、桌面抽屉、移动端列表、英语抽屉和默认数据。
- 修改登录/JWT 逻辑时，需要注意 `JWTUtils.isExpired()` 会清除过期 token，并可能触发消息提示。
- 修改链接或新增文档中的 URL 前，应先验证链接有效性。
- 生成或修改中文文档后，应检查中文是否变成问号、乱码或不必要的 Unicode 转义。

---

# 其他笔记

> **package.json版本细节说明**
> ```bash
> # 为特定包安装精确版本
> yarn add react@18.2.0 --exact
>
> # 在 package.json 中手动指定
> {
> "dependencies": {
> "react": "18.2.0",       // 精确版本
> "lodash": "^4.17.21",    // 允许小版本更新
> "moment": "~2.29.4"      // 仅允许补丁更新
> }
> }
>
> ```

> **`yarnrc` : 这是用于自定义 Yarn 包管理器的行为的文件。**
> - 在yarn 1.x中，配置项是写在.yarnrc文件中的，格式是键值对，每行一个配置。
> - 在yarn 2+中，配置项是写在.yarnrc.yml文件中的，格式是YAML。
>
> Yarn 配置的加载顺序：
> - 项目级 .yarnrc
> - 用户级 ~/.yarnrc
> - 全局 /etc/yarnrc

> `.editorconfig`**编辑器配置文件**
>
> .editorconfig 文件本身不直接执行格式化，而是由以下组件驱动：
> 编辑器/IDE 原生支持：
> - VS Code（需要安装 EditorConfig 插件）
> - WebStorm（内置支持）
> - IntelliJ IDEA（内置支持）
> - Sublime Text（需要插件）
> - Vim/Neovim（需要插件）
> 
> `.editorconfig` 的设计目标是解决**跨编辑器/IDE的基础编辑风格一致性问题**，比如缩进、换行符等。这些是独立于编程语言的。
> 所以不解析语言语法。如果要控制语言的格式，最佳方案：使用 Prettier:`yarn add -D prettier`,可以做到语言级格式化,比如统一字符串用单引号
