# agent.md

面向 AI Agent 的项目说明。在修改本仓库前请先阅读本文件。

## 项目概况

- **类型**：个人技术博客，Astro 静态站点
- **技术栈**：Astro 7.x + Tailwind CSS v4 + TypeScript，无 UI 框架（组件全部手写 .astro）
- **部署**：GitHub Pages 项目站点，地址 `https://2867744246.github.io/blog`，CI 见 `.github/workflows/deploy.yml`
- **Node 要求**：>= 22.12.0（Astro 7 硬性要求，勿用 Node 20）

## 常用命令

```bash
npm run dev        # 本地开发
npm run build      # 生产构建（改完代码务必跑一遍验证）
npm run preview    # 预览构建产物
npx astro check    # 类型检查（.astro 文件）
```

## 目录结构

```
src/
  config.ts            # 站点元信息（标题、作者、描述、github、分页大小）
  content.config.ts    # posts 集合 zod schema（frontmatter 校验规则）
  content/posts/       # 文章（Markdown）
  components/          # Header / Footer / PostCard / ThemeToggle / TableOfContents 等
  layouts/             # BaseLayout.astro 全站布局
  pages/               # 路由：首页分页 [...page]、posts/[...slug]、tags/[tag]、archive、about、rss.xml
  styles/global.css    # Tailwind v4 入口 + 暗色变体 + prose 插件
  utils/base.ts        # withBase 等路径工具
```

## 关键约定

### 文章 frontmatter（必填字段，schema 会校验）

```yaml
---
title: 文章标题
description: 一句话描述
pubDate: 2026-11-09
type: tech        # tech | essay
tags: [标签1, 标签2]
---
```

### 路径与 base

- 站点部署在 `/blog` 子路径，`astro.config.mjs` 中 `base: '/blog'`
- 站内链接必须用 `withBase()` 拼接前缀（见 `src/utils/base.ts`），禁止硬编码 `/posts/...`

### 样式

- Tailwind v4，暗色模式用 **class 策略**：`html.dark` 生效，写法 `dark:xxx`；切换逻辑在 ThemeToggle.astro（防 FOUC 的内联脚本在 BaseLayout）
- 主题强调色为 amber：正文强调 `amber-700 dark:amber-400`，hover 交互 `amber-600 dark:amber-400`
- **教训**：`global.css` 中禁止用 `@layer base` 包裹自定义样式来"隔离"——utilities 层在 base 之后会覆盖它，曾导致暗色模式文字不可见。模板遗留样式直接删除，不要包裹保留
- 字体变量 `--font-atkinson` 由 astro.config.mjs 的 fonts 集成注入，勿删相关配置

### 日期

- `FormattedDate.astro` 渲染日期必须用 `timeZone: 'UTC'`（zod 的 `z.coerce.date()` 产出 UTC 午夜，避免构建机时区差异导致日期偏移）

### 注释与提交

- 新代码/重写旧代码添加中文注释，清晰简洁，不写复述代码的冗余注释
- 代码遵循高内聚低耦合，避免单个方法过长
- Git 提交信息：中文 conventional commits（如 `feat: 新增标签页`、`fix: 修复暗色模式样式`）

## 环境注意事项（本机）

- 本机访问 github.com 走 schannel 的客户端（git、curl.exe、PowerShell）稳定；gh CLI 不可用（TLS 被拦），GitHub API 用 PowerShell `Invoke-RestMethod` + Bearer token
- npm 从 github.com 拉包前设 `$env:NODE_USE_SYSTEM_CA=1`；npm install 后核对 package.json 是否真的写入了依赖
- git push 偶发挂起无输出，前台重试一次即可

## 范围外（暂不实现）

评论（giscus）、全文搜索、访问统计、CMS、自定义域名。设计文档见 `docs/superpowers/specs/`，实施计划见 `docs/superpowers/plans/`。
