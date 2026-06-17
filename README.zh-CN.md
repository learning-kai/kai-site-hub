# Kai Site Hub

Kai Site Hub 是一个 MiMo Code 风格的 Kai 个人站点入口。它保留了原页面的首屏气质，同时把导航链接指向博客、GitHub、图床和 Nextcloud。

English version: [README.md](./README.md)

![预览图](docs/assets/website.png)

## 功能

- 首屏 canvas 擦除显影效果
- 中文桌面端打字机副标题
- 一键复制主页链接
- 中英文切换
- 4 张依赖本地资源的功能卡片

## 运行要求

- Windows、macOS 或 Linux
- 现代桌面浏览器
- Node.js 和 npm

## 安装与启动

```bash
npm install
npm run dev
```

启动后打开 `http://127.0.0.1:4173/`。

## 常用命令

```bash
npm run dev
npm run dev -- --port 4173
npm run build
npm run test:e2e
npm run preview
```

## 配置说明

- `src/i18n.js` 维护中英文文案。
- `src/App.jsx` 维护外链和语言状态。
- `public/coder/assets/` 存放镜像的字体、图片和图标。
- `tests/mimocode.spec.ts` 覆盖渲染、资源加载、复制行为和语言切换。

## 常见问题

- 复制失败时，检查浏览器剪贴板权限。
- 资源未加载时，确认 `/coder/assets/...` 路径没有被改坏。
- 文本乱码时，确认文件保存为 UTF-8。

## 许可证

许可证尚未确定。
