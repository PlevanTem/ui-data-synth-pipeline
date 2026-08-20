# Output Structure

这个文件定义 `web-design-pipeline` 的目录、命名和归档规范。执行时优先遵守这里，而不是临时自由发挥。

**当前管线版本**：`v8.1`（2026-05-15）— 在 v8 基础上反转 `_build/` 清理策略：**保留前端工程源码目录**，便于后续源码 review、二次迭代、debug。bundle.html 仍是唯一最终交付，但同级 `_build/` 不再删除。同时新增针对 ESM/CJS 互通、`file://` 加载、p5.js 禁用等多条工程红线，详见 `references/engineering-guardrails.md` §11。

---

## Case 命名

格式：

```text
{case_id}@v{N}_{YYYYMMDD}
```

- 来自测试集（有 `id` + `domain`）：`{NNN}_{domain_slug}`，例如 `001_devtools@v8_20260514`
- 来自单条 query：`{2-4个英文小写词}@v8_{YYYYMMDD}`，例如 `habit-tracker@v8_20260514`
- 同一天同一 slug 多次运行：末尾加 `-2`、`-3`

## 目录结构

```text
outputs/
└── {case_id}@v8_{YYYYMMDD}/
    ├── meta.json
    ├── 01_pm/
    │   └── prdSpec.json        ← PM 唯一产物：11 字段固定 Schema 的需求规格
    ├── 02_designer/
    │   └── design_brief.md     ← Designer 唯一产物：设计系统 + 组件规范 + 特效方案
    └── 03_frontend/
        └── bundle.html         ← Frontend 唯一最终交付（parcel + html-inline 单文件产物）
```

说明：

- **`bundle.html` 是每个 case 唯一的前端最终交付**，浏览器中**直接双击**即可运行，无需 `npm install` 或本地服务器
- React + TypeScript + Vite 工程源码在 Frontend Agent 执行期间放在 `03_frontend/_build/` 下；bundle 成功后 **保留 `_build/`**（v8.1 政策变更），便于源码归档、二次迭代、debug。归档时只把 `_build/bundle.html` 移到 `03_frontend/bundle.html` 一级
- 第三方视觉库（Three.js / GSAP / D3 等）通过 `pnpm add` 安装为 npm 依赖，会被 parcel 打包进 `bundle.html`；不再通过 CDN 引入
- **p5.js 在 v8.1 起禁用**（Parcel ESM/CJS 互通问题），纸感颗粒 / 噪点纹理改用 CSS `feTurbulence` SVG 噪声 data-URI
- 字体仍通过 Google Fonts `<link>` 引入（html-inline 不会内联跨域 CSS，符合预期）；推荐由 `src/main.tsx` 运行时注入 `<link>` 标签而非写死在 `index.html`

## 工程目录约定（v8.1 起保留）

```text
03_frontend/
├── bundle.html              ← 最终交付，浏览器双击运行
└── _build/                  ← 保留的工程源码（可用 `cd _build && pnpm dev` 二次迭代）
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    ├── node_modules/        ← 占空间大，但保留以便不重装也能 pnpm dev
    └── src/
        ├── main.tsx          ← 必含 RootErrorBoundary 包裹 <App />
        ├── App.tsx
        ├── index.css        ← shadcn CSS 变量从 design_brief.md 直接复制至此
        ├── components/
        │   ├── ui/          ← shadcn 预装组件，可选择性引用
        │   └── ...          ← 自定义组件
        └── lib/utils.ts
```

`_build/node_modules/` 体积较大（典型 200-400MB），但对 case 归档是可接受成本。**如果磁盘空间紧张**，用户可手动 `rm -rf _build/node_modules`，保留源码；后续需要重建时在 `_build/` 下 `pnpm install` 即可。**Frontend Agent 不主动删除任何 `_build/` 内容**。
