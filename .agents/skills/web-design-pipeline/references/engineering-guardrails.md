# 前端工程化防坑指南 (Engineering Guardrails)

本文档记录了 Web Design Pipeline 在自动化生成与构建前端项目时常见的工程环境、依赖冲突与语法错误，并提供标准解法。Frontend Agent 在搭建脚手架和编写代码时必须严格遵守。

## 1. 拥抱 Tailwind CSS V4 原生架构
- **现象**：最新生态已经全面向 Tailwind V4 的无配置（CSS-only）架构演进，依赖 `tailwind.config.js` 的老旧工作流会导致排版崩溃。
- **强制约束**：
  - **禁止创建** `tailwind.config.js` 或 `tailwind.config.ts`。
  - 前端 Agent 在搭建脚手架时，如果安装了 Tailwind V4，必须将所有设计 Token 转化为全局 CSS（如 `src/index.css` 或 `src/styles/globals.css`）。
  - **全局 CSS 文件必须遵循以下严格协议 `<globals_css_rules>`：**
    ```css
    /* Always import Google Fonts before any other CSS rules if needed. */
    @import url('https://fonts.googleapis.com/css2?...'); 
    
    /* Always use @import "tailwindcss"; to pull in default Tailwind CSS styling */
    @import "tailwindcss";
    /* Always use @import "tw-animate-css"; to pull default Tailwind CSS animations if needed */
    
    /* Always use @custom-variant dark to support dark mode styling via class name. */
    @custom-variant dark (&:is(.dark *));

    /* Always use @theme to define semantic design tokens based on the design system. */
    @theme {
      --color-background: #09090B;
      --color-primary: #FAFAFA;
      --radius-sm: 8px;
    }

    /* Always use @layer base to define classic CSS styles. Only use base CSS styling syntax here. Do not use @apply. */
    @layer base {
      body {
        background-color: var(--color-background);
        color: var(--color-primary);
      }
    }
    /* Always reference colors via their CSS variables—e.g., use var(--color-muted) in all generated CSS. */
    ```

## 2. Vite + TypeScript 严格类型导出报错 (白屏)
- **现象**：在 Vite + SWC/ESBuild 的急速热更新(HMR)环境下，如果直接使用 `import { SomeInterface } from './types'` 导入纯类型定义，会导致页面白屏，控制台报错 `SyntaxError: The requested module does not provide an export named...`。
- **解法**：TypeScript 类型导入必须显式使用 `type` 关键字。
  - **错误用法**：`import { Device, Scene } from '../types';`
  - **正确用法**：`import type { Device, Scene } from '../types';`

## 3. Windows / 跨平台脚手架初始化异常
- **现象**：使用连续 `&&` 命令链（如 `cd dir && npm create vite...`）并在不存在的嵌套目录中直接拉取脚手架，容易在 PowerShell 或 Windows 终端中引发 `ENOENT` 目录找不到的错误。
- **解法**：确保命令的原子性和安全性。Agent 在初始化工程时：
  - 避免过长的串联执行，分步骤调用 `Shell` 且正确使用 `working_directory` 参数。
  - 初始化 Vite 前先确保目标父级文件夹存在。

## 4. 残留的样板代码污染
- **现象**：Vite 初始化生成的 `App.css` 或默认的居中排版逻辑会与我们自定义的 `index.css` 及 Tailwind 类冲突。
- **解法**：创建项目后，第一时间删除 Vite 默认的 `src/App.css`，并在 `src/main.tsx` 中移除对其的引用。

*(此文档将在后续流水线运行中持续迭代沉淀)*
