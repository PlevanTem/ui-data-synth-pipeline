# 前端工程化防坑指南 (Engineering Guardrails)

本文档记录 Web Design Pipeline 在 **v8 栈**（React 18 + TypeScript + Vite + Tailwind 3.4 + shadcn/ui，Parcel + html-inline 打包为单文件 `bundle.html`）下的常见坑与标准解法。Frontend Agent 在编写代码时必须严格遵守。

> v7 之前的 Tailwind CDN + 原生 JS 防坑（`tailwind.config = {}` 字面量、`theme()` 在普通 `<style>` 里失效、CDN 加载顺序等）在 v8 全部作废。如果你看到 `cdn.tailwindcss.com` / `tailwind.config = {...}` 字面量 / 把 GSAP 用 `<script src="">` 引入这类写法，立即重写。

---

## 0. 环境前置（缺一不可）

| 依赖 | 最低版本 | 检查命令 |
|---|---|---|
| Node.js | 18+ | `node -v` |
| pnpm | 8+ | `pnpm -v`（缺失时 `init-artifact.sh` 会自动 `npm i -g pnpm`） |
| bash | 任意 | `bash --version`（Windows 通过 Git Bash / WSL / Claude Code 内建 Bash 工具） |

如果 Node 版本低于 18，`init-artifact.sh` 会 fail fast。**不要尝试自己 polyfill 老 Node**。

`init-artifact.sh` 与 `bundle-artifact.sh` 位于 web-artifacts-builder skill 的 `scripts/` 目录下，运行时通过 skill 解析路径调用，不要把脚本拷贝进项目。

---

## 1. 初始化 + 打包流程的标准动作

脚本已**预装在项目本地** `.claude/skills/web-design-pipeline/scripts/`。从项目根目录起：

```bash
# 在项目根目录捕获脚本绝对路径（避免 cd 后路径失效）
SCRIPTS_DIR="$(pwd)/.claude/skills/web-design-pipeline/scripts"

# 第 1 步：脚手架（在 03_frontend/ 下执行，产出 _build/ 工程目录）
cd outputs/{case_id}@v8_{YYYYMMDD}/03_frontend
bash "$SCRIPTS_DIR/init-artifact.sh" _build
cd _build

# 第 2 步：编辑 src/index.css、tailwind.config.js、src/App.tsx 等
# （由 Frontend Agent 用 Edit/Write 工具完成）

# 第 3 步：打包
bash "$SCRIPTS_DIR/bundle-artifact.sh"
# 产出 _build/bundle.html

# 第 4 步：归档
mv bundle.html ../bundle.html
cd ..
rm -rf _build
```

---

## 2. shadcn 主题系统（CSS 变量 + tailwind.config.js 双段配合）

shadcn 的颜色主题由 **CSS 变量** 驱动，Tailwind 通过 `hsl(var(--xxx))` 引用。Designer Agent 已经在 `design_brief.md` 的 Tailwind 配置章节给出 **Block A**（CSS 变量）和 **Block B**（tailwind.config.js extend），Frontend Agent 直接粘贴。

### Block A：放在 `src/index.css` 的 `@layer base { :root {...} }` 内

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 220 14% 4%;          /* HSL 三元，不要带 hsl() 包裹 */
    --foreground: 0 0% 95%;
    --primary: 24 100% 50%;
    --primary-foreground: 0 0% 100%;
    --secondary: 220 14% 12%;
    --secondary-foreground: 0 0% 95%;
    --muted: 220 14% 10%;
    --muted-foreground: 220 14% 65%;
    --accent: 24 100% 60%;
    --accent-foreground: 0 0% 100%;
    --border: 220 14% 14%;
    --input: 220 14% 14%;
    --ring: 24 100% 60%;
    --card: 220 14% 6%;
    --card-foreground: 0 0% 95%;
    --popover: 220 14% 6%;
    --popover-foreground: 0 0% 95%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 98%;
    --radius: 0.75rem;
  }

  .dark {
    /* 暗色 token，按 design_brief.md Block A 写入 */
  }

  body {
    @apply bg-background text-foreground;
    font-family: var(--font-sans);
  }
}
```

**禁忌**：
- 不要写 `--primary: hsl(24, 100%, 50%);`——必须是裸三元 `24 100% 50%`，否则 `hsl(var(--primary) / 0.8)` 等带 alpha 的写法全部失效
- 不要在 `:root` 之外定义 shadcn token；shadcn 组件库默认从 `:root` / `.dark` 读取
- `--radius` 必须是有单位的长度值（`rem` / `px`），不是裸数

### Block B：放在 `tailwind.config.js` 的 `theme.extend` 内

```js
extend: {
  colors: {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    primary: {
      DEFAULT: 'hsl(var(--primary))',
      foreground: 'hsl(var(--primary-foreground))',
    },
    secondary: {
      DEFAULT: 'hsl(var(--secondary))',
      foreground: 'hsl(var(--secondary-foreground))',
    },
    muted: {
      DEFAULT: 'hsl(var(--muted))',
      foreground: 'hsl(var(--muted-foreground))',
    },
    accent: {
      DEFAULT: 'hsl(var(--accent))',
      foreground: 'hsl(var(--accent-foreground))',
    },
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
    card: {
      DEFAULT: 'hsl(var(--card))',
      foreground: 'hsl(var(--card-foreground))',
    },
    popover: {
      DEFAULT: 'hsl(var(--popover))',
      foreground: 'hsl(var(--popover-foreground))',
    },
    destructive: {
      DEFAULT: 'hsl(var(--destructive))',
      foreground: 'hsl(var(--destructive-foreground))',
    },
    // 案例专属品牌色（不走 shadcn 变量，直接写 hex）
    brand: { 500: '#FF6A00' },
  },
  borderRadius: {
    lg: 'var(--radius)',
    md: 'calc(var(--radius) - 2px)',
    sm: 'calc(var(--radius) - 4px)',
  },
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['"Space Grotesk"', 'sans-serif'],
  },
  boxShadow: {
    raised: '0 1px 2px 0 rgba(0,0,0,0.05)',
    floating: '0 8px 24px -8px rgba(0,0,0,0.25)',
    modal: '0 20px 50px -12px rgba(0,0,0,0.45)',
  },
}
```

**注意**：`init-artifact.sh` 已经预置了完整的 shadcn `theme.extend`（含 `colors` / `borderRadius` 全套引用）。Frontend Agent 的工作是在已有结构上**追加 / 覆盖** Designer 给出的 Block B 内容（典型是覆盖 `--primary` 配色、追加 `fontFamily`、追加 `brand` 等案例专属色、追加 `boxShadow`），不要把脚手架原有的 shadcn 引用全删。

---

## 3. 路径别名（`@/`）

`init-artifact.sh` 已经在 `tsconfig.json` 与 `vite.config.ts` 配置了 `@/` 指向 `src/`。打包时通过 `parcel-resolver-tspaths` 解析。

```ts
import { Button } from '@/components/ui/button'   // ✅
import { cn } from '@/lib/utils'                  // ✅
import { Button } from '../../components/ui/button' // ❌ 不要绕开
```

**禁忌**：
- 不要在 import 路径里手写 `.tsx` 后缀（`from '@/App.tsx'` ❌；`from '@/App'` ✅）
- 不要新增别名（如 `~/` / `#/`），`parcel-resolver-tspaths` 只处理 `tsconfig.json` 里 `paths` 字段定义的别名

---

## 4. shadcn 组件复用

`_build/src/components/ui/` 已预装 **40+ shadcn 组件**。常用清单：

| 组件 | 文件 | 何时用 |
|---|---|---|
| Button | `button.tsx` | 任何按钮（含 variant: default / destructive / outline / secondary / ghost / link）|
| Input | `input.tsx` | 文本输入 |
| Textarea | `textarea.tsx` | 多行输入 |
| Card | `card.tsx` | 内容卡片（CardHeader / CardTitle / CardContent / CardFooter）|
| Dialog | `dialog.tsx` | 模态框 |
| Sheet | `sheet.tsx` | 侧边抽屉、移动端导航展开 |
| Tabs | `tabs.tsx` | 标签页切换 |
| Select | `select.tsx` | 下拉选择 |
| DropdownMenu | `dropdown-menu.tsx` | 上下文菜单 |
| Toast / Toaster | `toast.tsx` | 全局通知 |
| Form | `form.tsx` | 表单 + react-hook-form 集成 |
| Accordion | `accordion.tsx` | 折叠面板 |
| Popover | `popover.tsx` | 浮层（非模态）|
| Tooltip | `tooltip.tsx` | 悬浮提示 |
| Badge | `badge.tsx` | 状态标签 |
| Switch / Checkbox / RadioGroup / Slider | 同名 .tsx | 标准表单控件 |

**何时不该用 shadcn**：
- design_brief 主方向是 brutalist / maximalist / 极繁 / 极简到反 shadcn 默认时，自写组件，避免被 shadcn 默认调性污染
- 视觉特效层（Canvas / WebGL / scroll-driven 大动画）不要套 shadcn 容器
- design_brief 在 Component Stylings 章节明确写「自写」时，不要复用

---

## 5. React + 第三方视觉库

p5.js / Three.js / GSAP / D3 / Lottie 等视觉库在 v8 栈下**通过 npm 安装**，不再用 CDN。

```bash
cd _build
pnpm add three                 # WebGL 3D
pnpm add p5                    # 生成式视觉
pnpm add gsap                  # 时间轴动画
pnpm add d3                    # 数据可视化
pnpm add chart.js              # 图表（轻量场景）
pnpm add lottie-react          # Lottie
pnpm add lenis                 # 平滑滚动
```

### 标准挂载模式（useEffect + 清理）

```tsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    mountRef.current.appendChild(renderer.domElement)

    let raf: number
    const animate = () => {
      raf = requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!mountRef.current) return
      const { clientWidth, clientHeight } = mountRef.current
      renderer.setSize(clientWidth, clientHeight)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="w-full h-screen" />
}
```

**禁忌**：
- 不要在组件外（模块顶部）实例化视觉库；React Strict Mode 下会双重挂载
- `useEffect` 必须 return 清理函数，否则热更新 / 路由切换会泄漏
- **不要用 `import('xxx')` 动态导入第三方库**——Parcel 会把动态 import 拆成独立 chunk（`xxx.HASH.js`），`html-inline` 默认不内联这些 chunk，bundle.html 在 `file://` 下打开时会静默 404，视觉特效悄无声息地失效。所有第三方库一律静态导入：`import Lenis from 'lenis'`
- **p5.js 在 v8 bundle 栈下禁用**：Parcel 对 p5 默认导出做 ESM/CJS 互通时，minify 后 `new p5(...)` 报 `s(...) is not a constructor` 直接白屏。改用 §11 的 CSS `feTurbulence` SVG 噪声 data-URI 实现纸张颗粒 / 噪点纹理

---

## 6. parcel build 常见报错

| 报错 | 原因 | 解法 |
|---|---|---|
| `Cannot find module '@/...'` | tsconfig paths 没配对 / `parcel-resolver-tspaths` 未生效 | 检查 `.parcelrc` 的 resolvers 顺序：`["parcel-resolver-tspaths", "..."]` |
| `Type error: Property 'x' does not exist on type 'never'` | TS 类型错误 | 修类型；不要 `// @ts-ignore` 蒙混（parcel 默认开 strict 类型检查） |
| `Browserslist: caniuse-lite is outdated` | 依赖版本警告 | 忽略 |
| `Could not resolve @rollup/...` | rollup 子依赖错配 | 删除 `_build/node_modules` 与 `pnpm-lock.yaml`，重新 `pnpm install` |
| html-inline 报跨域字体警告 | Google Fonts CSS 不会被内联 | 这是预期行为，bundle.html 仍会通过 `<link>` 引用字体 |
| `Failed to resolve '/favicon.svg'` | 新版 Vite 模板的 favicon 链接没被脚手架清掉（项目本地脚本已修复） | 若 STEP 3 注入完字体链接后仍残留 favicon `<link>`，手动 `sed -i '/<link rel="icon"/d' index.html` |
| Parcel postcss 警告 `Remove the above plugins from postcss.config.js` | parcel 自动检测 tailwind，不需要 postcss.config.js 显式声明 | 警告不影响打包；如想消除，删除 `_build/postcss.config.js` |

---

## 7. bundle.html 体积控制

- 默认 `bundle.html` 体积在 200KB - 1.5MB 之间（取决于是否引入 three.js / d3 等大库）
- **避免**把高分辨率位图通过 base64 嵌入 src/，体积会爆炸；改用 SVG / Canvas 生成 / Google Fonts 图标
- 如果引入 three.js + 其他大库后 `bundle.html` 超过 5MB，考虑在 design_brief 阶段就降级视觉特效方案
- bundle 完成后用 `du -h bundle.html` 检查体积，写入 meta.json（可选）

---

## 8. 避免 AI slop

来自 web-artifacts-builder skill 的硬性提醒：

- ❌ 过度居中布局（everything center-aligned）
- ❌ 默认紫蓝渐变（`from-purple-500 to-blue-600` 这类组合）
- ❌ 全站统一圆角（每个角落都 `rounded-2xl`）
- ❌ 默认 Inter 字体（必须按 design_brief 指定字体；如未指定，从 Space Grotesk / Geist / Manrope / Söhne / Fraunces / DM Serif / IBM Plex 等里**主动选择**一个匹配 aesthetic 的字体，不要 fallback 到 Inter）

design_brief.md 的 §1 Visual Theme & Atmosphere 已强约束这些；如发现 Designer 漏指定字体，Frontend Agent 应反馈而非默写 Inter。

---

## 9. 禁止事项

- 禁止使用 Tailwind CDN（`<script src="https://cdn.tailwindcss.com">`）
- 禁止 `tailwind.config = {...}` 字面量（旧 CDN 风格）
- 禁止把 React/Vue/Svelte 组件库通过 CDN 拉取
- 禁止保留 `_build/` 在最终归档中
- 禁止用 `// @ts-ignore` 跳过类型错误（强迫修真问题）
- 禁止用 `dangerouslySetInnerHTML` 渲染外部内容（XSS 红线）

---

## 10. 自检清单（bundle 后必做）

- [ ] `03_frontend/` 下有 `bundle.html`，同级 `_build/` 工程文件保留（v8.1 起不再删除）
- [ ] 双击 `bundle.html` 在浏览器打开，控制台无红色报错
- [ ] 主交互全部可用（导航、筛选、表单、动效、模态框）
- [ ] 响应式正常（Chrome DevTools 切到移动端尺寸不崩）
- [ ] `bundle.html` 体积合理（< 5MB；超过应回看视觉方案是否过载）
- [ ] 断网后双击仍可运行（除 Google Fonts 字体加载外）
- [ ] **bundle 文本里 `grep -c "is not a constructor"` 应为 0**（防御性检查 ESM/CJS 互通问题）

---

## 11. 单文件 bundle 在 `file://` 下打开的运行时陷阱（v8.1 沉淀）

这一节专门记录"bundle 编译成功但浏览器白屏"的真实坑。所有规则都来自已发生过的 case。

### 11.1 第三方库的 ESM/CJS 互通：默认导出可能不是构造器

**症状**：bundle.html 编译通过、html-inline 通过、parcel 退出码 0，但浏览器控制台报 `Uncaught TypeError: s(...) is not a constructor`，整页白屏。

**根因**：Parcel 把第三方库（典型：p5、某些老牌 CJS 库）的默认导出做 ESM/CJS 互通时，minify 后默认导出可能变成 `{ default: <真正构造器> }` 而不是构造器本身。`new s(...)` 中的 `s` 拿到的是包装对象，不可构造。

**强制规则**：
- **p5.js 在 v8 栈下禁用**——直接用 §11.3 的 CSS feTurbulence 噪声纹理替代
- 必须用某个库时，写防御性导入：
  ```typescript
  import * as ModNS from 'some-lib';
  const Ctor: any = (ModNS as any).default ?? ModNS;
  const instance = new Ctor(...);
  ```
- 库的实例化代码必须 `try/catch` 包裹——单个视觉效果失败不应该让整页白屏

### 11.2 动态 import 会被 Parcel 拆 chunk，html-inline 不会内联

**症状**：用了 `import('p5').then(...)` 或 `import('lenis').then(...)`，bundle.html 体积正常，但在 `file://` 下打开时该库相关功能"什么也没发生"，Network 面板看不到请求或显示 `blocked:origin`。

**根因**：Parcel 会把每个 `import(...)` 动态调用拆成独立 chunk 文件（如 `lenis.f1ca5ce8.js`），html-inline **只内联同文档内的 `<script src>` 引用**，不会把 chunk 文件递归打包进 bundle.html。从 `file://` 打开的 bundle.html 去加载平级 chunk 文件会被浏览器以 "same-origin policy" 拒绝。

**强制规则**：
- **所有第三方库一律静态 import**：`import Lenis from 'lenis'`、`import gsap from 'gsap'`、`import { ScrollTrigger } from 'gsap/ScrollTrigger'`
- 禁止 `import('xxx').then(...)` 任何形式的动态导入
- 唯一例外：Google Fonts CSS 跨域链接（见 11.4）

### 11.3 CSS feTurbulence 取代 p5 / Canvas 噪声层

需要"纸感颗粒 / 噪点滤镜 / 老胶片质感"等装饰性纹理时，**首选 CSS-only 方案**，零 JS 依赖：

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0 0.1  0 0 0 0.4 0'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.35'/></svg>");
  mix-blend-mode: multiply;
  opacity: 0.35;
}
```

调整 `baseFrequency`（颗粒密度）、`feColorMatrix` 末位（整体不透明度）、`opacity` 即可适配不同质感。**只有真正需要交互式 / 响应式 / 动态变化的生成式视觉时**才考虑 p5 / Canvas，且必须遵守 11.1 / 11.2 的导入规则。

### 11.4 Google Fonts 在 `file://` 下的加载

`html-inline` 不会内联跨域 CSS（这是预期行为，不是 bug）。Google Fonts 的加载策略：

- **推荐**：在 `src/main.tsx` 里运行时注入 `<link>` 标签，确保在 React 挂载前完成：
  ```typescript
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=...&display=swap';
  document.head.appendChild(fontLink);
  ```
- 备选：在 `index.html` `<head>` 写 `<link>`（也能用，但部分嗅探/沙箱场景可能误判为本地路径）
- 控制台出现 `bundle.html (blocked:origin)` 类警告时，去看是不是 favicon 之类无关请求，**不要误判为字体失败**

### 11.5 强制 Root Error Boundary

`src/main.tsx` 必须用 `RootErrorBoundary` 包裹 `<App />`。任何组件抛错时渲染一个可读的错误页（暖纸底 + 红字栈），而不是白屏。这让"上线后白屏"立刻可诊断：

```typescript
class RootErrorBoundary extends React.Component<{children: React.ReactNode}, {error: Error | null}> {
  constructor(props: any) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: any) { console.error('Root error:', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{padding:'40px',fontFamily:'serif',color:'#1F1A14',background:'#FBF7EF',minHeight:'100vh'}}>
          <h1 style={{fontSize:32,fontStyle:'italic'}}>Something stopped working.</h1>
          <pre style={{whiteSpace:'pre-wrap',marginTop:24,color:'#7A2E2A'}}>{String(this.state.error?.stack || this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### 11.6 CSS 变量过渡：transition consumers, not vars

**症状**：GSAP `gsap.to(root, { '--primary': newValue })` 在某些浏览器/CSS-var 场景下不生效或抖动。

**根因**：CSS 自定义属性本身的过渡支持参差——必须用 `@property` 注册才能可靠 transition，但 v8 工程链不强制 PostCSS plugins 处理 `@property`。

**强制规则**：
- 切换主题（如本案 `data-season`）时，**只翻动 `data-*` attribute on `<html>`**
- 在 CSS 里给 *消费这些变量的元素属性* 加 transition：
  ```css
  body, .recipe-card, button, a, .season-capsule {
    transition: background-color 600ms ease, color 600ms ease, border-color 600ms ease;
  }
  ```
- 不要让 GSAP 直接动 CSS 自定义属性

### 11.7 Bundle 后的静态自检命令

每次 bundle 完成后必须跑：

```bash
# 1. 体积
ls -lh bundle.html
# 2. 不是 0 字节 / 不是错误 dump
head -c 200 bundle.html | grep -c "<!DOCTYPE html"  # 应为 1
# 3. 没有遗留构造器错误
grep -c "is not a constructor" bundle.html          # 应为 0
# 4. 没有外部 script 引用残留（除 Google Fonts CSS）
grep -oE 'src="[^"]+"' bundle.html | grep -v 'data:' # 应只剩 fonts.googleapis 之类
```

任一项不符合立即排错，不要交付。

---

*(此文档在后续流水线运行中持续迭代沉淀)*
