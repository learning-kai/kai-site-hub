# Kai Site Hub

![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Stack](https://img.shields.io/badge/stack-React%2019%20%2B%20Vite%208%20%2B%20Tailwind%204-24292f)

简体中文 | [English](README.md)

Kai Site Hub 是一个 MiMo Code 风格的 Kai 个人站点入口，用本地资源、双语文案和 Playwright 端到端测试，把博客、GitHub、图床和 Nextcloud 收束到一个干净的首页。

![Kai Site Hub 预览图](docs/assets/website.png)

## 为什么做

个人入口页很容易滑向两个极端：要么是寒酸链接列表，要么是自嗨式落地页。这个项目选择更克制的方案：保留 MiMo Code 页面里的视觉节奏，把内容替换成 Kai 的真实公共站点，并保持静态前端的简单部署形态。

## 核心特性

- MiMo Code 风格首屏，使用本地背景图和 canvas 擦除显影效果。
- 配置驱动的导航，覆盖博客、GitHub、图床、Nextcloud 和产品下拉链接。
- 中英文语言切换，文案集中维护在 `src/i18n.js`。
- 一键复制主页链接，复制内容来自当前配置的 homepage URL。
- 4 张功能卡片，图片和站点截图均使用 `public/coder/assets/` 下的本地资源。
- Playwright 覆盖渲染、链接、资源加载、剪贴板行为和语言切换。

## 截图与演示

主预览图位于 `docs/assets/website.png`。运行页面只依赖 `public/coder/assets/` 下的本地图片和字体，不需要外部 CDN 来撑场面，这点比很多“看起来很高级但一断网就塌”的页面靠谱。

本地预览：

```bash
npm run dev -- --port 4173
```

然后打开 `http://127.0.0.1:4173/`。

## 快速开始

运行要求：

- Node.js 和 npm
- Windows、macOS 或 Linux
- 用于本地验证的现代 Chromium、Firefox 或 WebKit 浏览器

安装并启动：

```bash
npm install
npm run dev -- --port 4173
```

构建与测试：

```bash
npm run build
npm run test:e2e
```

常用脚本：

```bash
npm run dev
npm run dev -- --port 4173
npm run build
npm run preview
npm run test:e2e
```

## 工程质量

- Vite 8 负责快速、轻量的前端构建。
- React 19 负责应用状态、语言选择和导航渲染。
- Tailwind CSS 4 通过 `@tailwindcss/vite` 接入，像素敏感的复刻样式保留在 `src/styles.css`。
- Playwright 直接验证真实页面行为，不靠“我看代码觉得没问题”这种玄学。
- `.gitignore` 排除了生成产物、本地依赖、测试报告和日志。

## 项目文档

- `src/App.jsx`：顶层应用组合、语言状态和链接收集。
- `src/nav.config.json`：可编辑的顶部导航和下拉菜单数据。
- `src/i18n.js`：中英文文案与功能卡片元数据。
- `src/components/`：页面分区和可复用 UI 组件。
- `src/hooks/`：canvas 显影、打字效果和复制行为等浏览器交互。
- `docs/mouse-erase-reveal-effect.md`：首屏擦除显影实现说明。
- `docs/subtitle-typewriter-effect.md`：副标题打字效果实现说明。
- `tests/mimocode.spec.ts`：面向核心用户行为的 Playwright 测试。

## 隐私与安全边界

这是一个静态前端项目，不包含服务端、数据库、统计 SDK、登录流程或需要提交密钥的环境文件。页面外链指向 Kai 的公开服务，剪贴板按钮只写入配置中的主页 URL。

发布前不要提交 `.env`、私钥、生成报告、`node_modules/` 或 `dist/`。这不是洁癖，是基本职业卫生。

## 发布与更新

当前包版本：`0.1.0`。

目前尚未创建 GitHub Release。源码更新通过当前分支上的普通 Git 提交发布。

## 路线图

- 托管目标确定后补充线上演示地址。
- 继续通过 `src/nav.config.json` 维护导航变更。
- 如果页面复刻精度变得难以人工维护，补充视觉回归测试。
- 当项目进入带标签的公开版本后，补充 release notes。

## 贡献

提交前保持改动聚焦，并完成验证：

```bash
npm run test:e2e
npm run build
```

修改文案或链接时，优先更新 `src/i18n.js` 或 `src/nav.config.json`。修改视觉样式时，除非明确改变设计方向，否则保留 MiMo Code 风格的布局节奏。

## 故障排查

- 复制失败时，检查浏览器剪贴板权限。
- 图片未加载时，确认 `/coder/assets/...` 路径正确，并且文件存在于 `public/coder/assets/`。
- 文本乱码时，确认文件保存为 UTF-8。
- Playwright 无法启动浏览器时，执行 `npx playwright install` 后再运行 `npm run test:e2e`。

## License

本项目基于 [MIT License](./LICENSE) 发布。
