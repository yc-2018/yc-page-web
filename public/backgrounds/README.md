# 首页动态背景资源

本目录中的 CSS 和 JavaScript 会作为静态插件被首页按需加载，不经过 Vite 编译。

## 新增背景

1. 在 `css` 或 `js` 目录新增资源文件。
2. 在 `manifest.json` 的 `items` 中注册背景。
3. `source` 只能使用 `css://小写标识` 或 `js://小写标识`。
4. `entry` 必须是本目录内的相对路径，不允许远程 URL 或 `..`。
5. 执行 `yarn check:backgrounds`、`yarn lint` 和 `yarn build`。

CSS 背景必须把所有选择器限制在对应的
`[data-background-source='css://背景标识']` 容器下。容器会按照 `layers` 创建
`.yc-background-layer` 装饰层，动画应完全由 CSS 完成。

JavaScript 背景必须导出以下函数：

```js
export function mountBackground(container, options) {
  return {
    pause() {},
    resume() {},
    destroy() {},
  };
}
```

`options` 包含：

- `reducedMotion`：站内是否主动关闭动态效果；当前首页默认传入 `false`。
- `pixelRatio`：首页根据设备性能计算的像素比上限。
- `quality`：`low` 或 `balanced`。

背景模块必须在 `destroy` 中取消动画帧、移除事件监听器，并释放 WebGL 资源。

## 热更新

替换资源时递增该背景的 `version`。先上传 CSS/JS 等资源文件，最后上传
`manifest.json`，刷新首页后即可生效。热更新完成后，还需要把同一批文件同步回本目录并提交，
否则下一次整站构建部署可能覆盖服务器上的新版本。

## Three.js

Three.js 使用同源的 `vendor/three-0.185.1.module.min.js` 及其内部依赖
`vendor/three.core.min.js`，来源为官方 npm 包 `three@0.185.1`。许可证保存在
`vendor/three-LICENSE.txt`。

## 内置 JavaScript 背景

- `js://starfield`：鼠标视差星空隧道。
- `js://particle-wave`：鼠标扰动空间粒子波浪。
- `js://earth`：程序化蓝色地球。
- `js://fish`：俯视鱼群；移动鼠标生成水波并驱散附近鱼群，左键点击生成更强的双层水波。
