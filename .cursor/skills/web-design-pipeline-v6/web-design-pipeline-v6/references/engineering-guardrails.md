# 前端工程化防坑指南 (Engineering Guardrails)

本文档记录 Web Design Pipeline 在生成单文件 HTML + Tailwind CDN + 原生 JS 时的常见坑与标准解法。Frontend Agent 在编写代码时必须严格遵守。

---

## 1. Tailwind CDN 引入与配置

**标准写法**：

```html
<head>
  <!-- 1. Google Fonts（如需要） -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />

  <!-- 2. Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- 3. tailwind.config 必须在 Tailwind CDN 之后、</head> 之前 -->
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: '#你的颜色',
            background: '#你的背景色'
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif']
          }
        }
      }
    }
  </script>

  <!-- 4. 全局自定义样式（最小化，优先用 Tailwind 类） -->
  <style type="text/tailwindcss">
    @layer base {
      body { @apply bg-background text-primary; }
    }
  </style>
</head>
```

**防坑要点**：
- `tailwind.config` 赋值必须在 Tailwind CDN `<script>` **之后**，否则配置不生效
- CDN Tailwind **不支持** `@theme` 指令（V4 原生语法），只能用 `tailwind.config` JS 对象
- CDN Tailwind **不支持** `@import "tailwindcss"` 指令，不要写这行
- 如需在 `<style>` 内使用 Tailwind，加 `type="text/tailwindcss"` 属性
- 普通 `<style>` 里的 CSS **不能写** `theme('colors.xxx')`、`theme('fontFamily.xxx')`、`theme('boxShadow.xxx')` 这类构建期 helper；浏览器不会解析，样式会直接失效
- 如果样式写在普通 `<style>` 中，必须改用原生 CSS 变量、十六进制颜色、标准字体栈、标准阴影值；不要误以为 Tailwind CDN 会替你展开 `theme()`

**错误示例**：

```html
<style>
  body {
    background-color: theme('colors.base');
    color: theme('colors.textPrimary');
  }
</style>
```

**正确示例**：

```html
<style>
  :root {
    --color-base: #09090b;
    --color-text-primary: #f5f5f7;
  }

  body {
    background-color: var(--color-base);
    color: var(--color-text-primary);
  }
</style>
```

**事故复盘**：
- 本地直接打开单文件 HTML 时，`theme()` 不会被浏览器执行
- 一旦 `body` 背景色和文字色这类基础样式失效，页面会回退成白底/黑字或局部配色错乱
- Frontend Agent 在交付前必须全文搜索 `theme\(`，确认它没有出现在普通 `<style>` 中

---

## 2. JS 执行时机

**现象**：直接在 `<head>` 或 `<body>` 顶部操作 DOM，会因为元素还未渲染而导致 `null` 报错。

**解法**：

```html
<!-- 方案 A：script 放在 </body> 之前（推荐） -->
<body>
  <div id="app">...</div>
  <script>
    // 此处 DOM 已完全加载
    const app = document.getElementById('app');
  </script>
</body>

<!-- 方案 B：使用 DOMContentLoaded -->
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
  });
</script>
```

---

## 3. Canvas / WebGL 初始化

**现象**：在 DOM 未加载前获取 canvas，`getContext()` 返回 `null`，导致后续绘制报错。

**解法**：

```html
<body>
  <canvas id="myCanvas"></canvas>
  <script>
    // 确保在 </body> 前或 DOMContentLoaded 后初始化
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    // 设置 canvas 尺寸
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // 响应窗口缩放
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  </script>
</body>
```

---

## 4. CDN 库加载顺序

**现象**：在 CDN 库加载完成前使用其 API，导致 `gsap is not defined`、`THREE is not defined` 等错误。

**解法**：所有 CDN 库的 `<script src="...">` 必须**先于**使用它们的 `<script>` 代码块：

```html
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
</head>
<body>
  ...
  <script>
    // 此时 gsap 已可用
    gsap.from('.hero', { opacity: 0, y: 50, duration: 1 });
  </script>
</body>
```

---

## 5. p5.js 使用模式

p5.js 有两种使用模式，单文件场景推荐**实例模式**（避免污染全局命名空间）：

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js"></script>
<script>
  const sketch = (p) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
    };
    p.draw = () => {
      p.background(0);
      // 绘制逻辑
    };
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  };
  new p5(sketch, document.getElementById('canvas-container'));
</script>
```

---

## 6. 原生 JS 状态管理

单文件中管理页面状态，推荐集中式对象模式：

```javascript
// 全局状态对象
const state = {
  activeTab: 'home',
  filterCategory: 'all',
  searchQuery: '',
  isDarkMode: false
};

// 状态更新函数
function setState(key, value) {
  state[key] = value;
  render(); // 触发 UI 更新
}

// 统一渲染函数
function render() {
  // 根据 state 更新 DOM
  document.querySelectorAll('[data-tab]').forEach(el => {
    el.classList.toggle('hidden', el.dataset.tab !== state.activeTab);
  });
}

// 事件绑定（在 DOMContentLoaded 后）
document.addEventListener('DOMContentLoaded', () => {
  render();
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => setState('activeTab', btn.dataset.nav));
  });
});
```

---

## 7. 滚动触发动画（Intersection Observer）

不依赖外部库的滚动动效标准写法：

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target); // 只触发一次
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate]').forEach(el => {
  observer.observe(el);
});
```

```css
/* 在 <style type="text/tailwindcss"> 中 */
@layer utilities {
  .animate-in {
    animation: fadeInUp 0.6s ease forwards;
  }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 8. 禁止事项

- 禁止引入需要 `npm install` 的依赖（`node_modules` 相关）
- 禁止使用 TypeScript 语法（尖括号泛型、类型注解等）
- 禁止使用 ES Module 的 `import/export`（CDN 环境默认全局变量方式）
- 禁止创建 `package.json`、`tsconfig.json`、`vite.config.js` 等构建配置文件
- 禁止使用 `@theme`、`@import "tailwindcss"` 等 Tailwind V4 CLI 专属指令

---

## 9. 常用 CDN 地址速查

| 库 | CDN URL |
|---|---|
| Tailwind CSS | `https://cdn.tailwindcss.com` |
| p5.js | `https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js` |
| Three.js | `https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js` |
| GSAP | `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js` |
| GSAP ScrollTrigger | `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js` |
| D3.js | `https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js` |
| Chart.js | `https://cdn.jsdelivr.net/npm/chart.js` |
| Anime.js | `https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js` |
| Alpine.js | `https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js` |
| Lottie | `https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js` |

*(此文档在后续流水线运行中持续迭代沉淀)*
