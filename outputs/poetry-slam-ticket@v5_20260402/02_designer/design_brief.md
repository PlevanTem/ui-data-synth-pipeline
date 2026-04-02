# International Collaborative Poetry Slam — Design Brief

## 设计问题陈述

这个产品需要让**文学爱好者和潜在参赛者**在**浏览链接、初步了解活动**的状态下迅速建立信任感和期待感，并顺利完成购票决策。核心挑战是：**在一个静态信息页面上传达出诗歌活动本身的文化温度和仪式感，而不只是堆砌信息表格**。视觉上需要建立"高雅文学活动"的专业信任感，交互上需要支撑 medium 密度的信息浏览和一键注册的操作流。

---

## 风格探索

### 方向 A（保守）：传统印刷邀请函数字化
- 风格关键词：奶油白底、黑色衬线体、边框装饰、经典比例
- 视觉证据：The Aspen Words Literary Prize 邀请函采用一致的品牌化印刷风格，保持年度清晰感
- 生成式视觉：无，纯排版驱动
- 不选原因：视觉吸引力不足，在数字端缺乏表现力，与竞品同质化严重

### 方向 B（主推）：文学编辑风 + 羊皮纸质感 + Canvas 水墨烟雾
- 风格关键词：暖米色纸感、深酒红强调色、Playfair Display 大衬线标题、水墨蔓延动效
- 视觉证据：Vilenica 文学节40周年重新设计强调"清晰、新鲜与文化可达性"；Inprint Poets & Writers Ball 用手工艺品感传递仪式感；Lora / Playfair Display 衬线字体正在成为2025-2026文化类网站的主流选择（Lexington Themes 2026最佳新衬线字体报告）
- 生成式视觉：Canvas 2D 水墨粒子流（背景英雄区，低密度、慢速漂移），SVG 装饰性墨迹分隔线
- 选择理由：最能承载诗歌活动的文化温度，同时在视觉上有独特表现力；羊皮纸质感 + 水墨动效组合在同类活动页中少见

### 方向 C（实验）：滚动电影叙事 + 生成文字蔓延
- 风格关键词：暗色底、霓虹文字粒子、打字机效果、scroll-driven 场景切换
- 视觉证据：Vector Festival 2025 互动网络装置"Living & Growing & Decaying"用文字变形蔓延表达诗歌时间性
- 生成式视觉：文字粒子系统 + GSAP ScrollTrigger 驱动场景转换
- 不选原因：暗色调与此次"国际精英活动邀请"的温暖、被邀请的仪式感存在情绪错位；实现复杂度超出本 case 要求

**主选方向 B**，规避同质化要点：
- **禁用**：蓝紫渐变 hero、玻璃拟态卡片、极简纯白无衬线
- **强调**：以"纸张 × 水墨 × 衬线排版"三元组合建立差异化视觉语言
- **创新**：Canvas 水墨粒子层 + 票面虚线边框装饰 + 首字下沉 + SVG 分隔装饰线

---

## 设计系统 Token

### 色彩

| 用途 | Token 名 | 值 |
|-----|---------|---|
| 页面背景 | bg-base | `#F5EDD8` |
| 内容卡片背景 | bg-card | `#FDF8EE` |
| 主色（酒红） | color-primary | `#8B1A2E` |
| 强调色（金铜） | color-accent | `#C49A44` |
| 主文字 | text-main | `#1E1A14` |
| 次级文字 | text-muted | `#6B5D4A` |
| 边框/分隔线 | border-base | `#D4C4A0` |
| CTA 按钮背景 | btn-cta | `#8B1A2E` |
| CTA 按钮 hover | btn-cta-hover | `#6B1222` |
| 表格斑马条纹 | table-stripe | `#F0E8D4` |
| 页脚背景 | bg-footer | `#1E1A14` |
| 页脚文字 | text-footer | `#B0A080` |

### 排版

- **展示字体（标题）**：Playfair Display（CDN: `https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap`）
- **正文字体**：Lora（CDN: `https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&display=swap`）
- **辅助无衬线（标签、说明）**：系统字体栈 `system-ui, -apple-system, sans-serif`

| 层级 | 字号 | 字重 | 行高 |
|------|------|------|------|
| h1（活动名） | 3.5rem / 56px | 700 | 1.15 |
| h2（区块标题） | 1.875rem / 30px | 700 | 1.3 |
| h3（子标题） | 1.25rem / 20px | 600 | 1.4 |
| body | 1rem / 16px | 400 | 1.75 |
| caption/label | 0.8125rem / 13px | 400 | 1.5 |

### 间距

基准单位 4px，常用值：`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px`

### 圆角

| 等级 | 值 |
|-----|---|
| sm | 2px |
| md | 6px |
| lg | 12px |
| pill | 9999px |

### 阴影

| 层级 | box-shadow 值 |
|-----|--------------|
| 卡片 | `0 2px 16px rgba(30,26,20,0.10)` |
| 浮起 (hover) | `0 8px 32px rgba(30,26,20,0.18)` |
| 按钮 | `0 4px 12px rgba(139,26,46,0.30)` |

### 动效节奏

- **快速 (120ms)**：hover 颜色过渡、focus 边框
- **正常 (300ms)**：按钮 hover 缩放、卡片浮起
- **慢速 (600ms)**：区块入场淡入上浮
- **超慢 (2000ms+)**：水墨粒子漂移循环
- **缓动**：`cubic-bezier(0.25, 0.46, 0.45, 0.94)`（ease-out-quad）；按钮：`cubic-bezier(0.34, 1.56, 0.64, 1)`（轻弹性）

---

## 组件规范

### Hero 首屏

- **作用**：建立情绪，传递活动基本信息
- **气质**：大面积暖米色底 + Canvas 水墨粒子背景层 + 居中大衬线标题
- **结构**：居中容器，顶部小徽标装饰（"★ INTERNATIONAL ★" 弧形文字或横排），主标题 Playfair Display 700，副标题日期/地点 Lora italic，底部引导箭头
- **状态**：页面加载后 0.4s 延迟触发标题从下向上淡入（translateY(20px) → 0 + opacity 0→1）
- **联动**：无内部联动

### 时间与地点双栏

- **作用**：一眼确认日程安排可行性
- **气质**：两个并列卡片，带细边框和图标（时钟图标 / 地图图钉图标），卡片背景 `bg-card`
- **状态**：hover 时阴影加深，轻微上浮 `translateY(-4px)`，transition 300ms
- **联动**：无

### 活动描述

- **作用**：深化理解，强化参与意愿
- **气质**：正文 Lora 体，首字下沉（CSS `::first-letter`），大号显示，颜色 `color-primary`；段落左右各有 SVG 装饰性墨迹边框
- **状态**：进入视口时淡入
- **联动**：无

### 票价表格

- **作用**：完成定价判断
- **气质**：带边框表格，标题行 `color-primary` 背景，奇偶行交替 `table-stripe`，VIP 行加 `color-accent` 左侧 3px 实线高亮
- **状态**：hover 行背景加深 `rgba(196,154,68,0.12)`，cursor pointer
- **联动**：无

### CTA 注册按钮

- **作用**：将意向转化为行动
- **气质**：`btn-cta` 背景，白色文字，Lora 字体，大尺寸（padding 16px 48px），圆角 pill，阴影
- **状态**：hover → `btn-cta-hover` + 轻微放大 `scale(1.03)` + 阴影加深；active → scale(0.98)；focus → 外描边
- **联动**：点击直接跳转外部 URL

### 评奖标准可视化

- **作用**：展示评分规则，增加公信力
- **气质**：五行水平进度条，每条对应一个标准，进度条宽度按分值比例（总100分），进度条颜色 `color-primary` + 透明度叠加，宽度在进入视口时 animated grow（width: 0 → 目标宽度）
- **状态**：Intersection Observer 触发宽度增长动画，duration 800ms stagger
- **联动**：无

### 奖项卡片组

- **作用**：激励参赛者
- **气质**：三列卡片（1st/2nd/3rd），1st 位有 `color-accent` 金铜边框强调；每个卡片有奖牌图标（纯 CSS 或 Unicode）、奖项等级、奖金、描述
- **状态**：hover 上浮 + 阴影加深
- **联动**：无

### 页脚

- **作用**：提供联系出口，完成品牌背书
- **气质**：深色背景 `bg-footer`，暖金色文字 `text-footer`，联系方式 + 赞助商 logo 文字行
- **状态**：无交互
- **联动**：无

---

## 页面交互清单
（Frontend 必须完整实现）

- [ ] 页面加载：Hero 标题和副标题按顺序淡入上浮（staggered，延迟 0.2s / 0.4s / 0.6s）
- [ ] 时间与地点卡片：hover 上浮 + 阴影变化
- [ ] 票价表格：hover 行高亮（背景色过渡）
- [ ] 评奖标准进度条：进入视口时宽度 0 → 目标宽度 动画增长（stagger 依次触发）
- [ ] 奖项卡片：hover 上浮 + 阴影变化
- [ ] CTA 按钮：hover scale + 颜色变化 + 阴影；click 跳转外部 URL（target="_blank"）
- [ ] 所有区块：Intersection Observer 滚动入场动画（淡入 + translateY）
- [ ] Canvas 水墨粒子背景：Hero 区背景层，慢速漂移，不遮挡文字
- [ ] 移动端适配：双栏 → 单栏，表格水平滚动

---

## 视觉特效方案

### 生成式视觉层：Canvas 水墨烟雾粒子

- **技术**：Canvas 2D API（原生，无需额外 CDN）
- **算法**：简单 Perlin/simplex 噪声场模拟水墨烟雾粒子游走
  - 粒子数量：60–80 个
  - 每粒子：起始随机位置，速度 0.2–0.5px/frame，方向受噪声函数扰动
  - 颜色：`rgba(139, 26, 46, 0.04)` 到 `rgba(196, 154, 68, 0.06)`（极低透明度）
  - 粒子半径：30–80px，模糊效果用 `ctx.filter = 'blur(20px)'`
  - 每帧 canvas 不完全清空（`fillRect` + 极低透明度叠加），产生拖尾效果
- **区域**：仅 Hero 区 canvas 层，position: absolute，z-index: 0，内容层 z-index: 1
- **参数范围**：透明度极低，视觉上几乎不干扰内容，只营造空间感
- **CDN**：无需额外 CDN，纯原生 Canvas 2D

### 装饰性 SVG 元素

- **活动描述区**：两侧 SVG 手绘线条装饰（简单波浪线或墨迹纹）
- **区块分隔**：SVG 羽毛笔分隔线（或华丽的衬线装饰符号 `❧` / `✦`）
- **实现**：内联 SVG，CSS 动画 `stroke-dashoffset` 入场绘制效果

### 动效方案

- **入场动画**：Intersection Observer + CSS transition（`opacity + translateY`），stagger 通过 `setTimeout` 延迟实现
- **进度条动画**：Intersection Observer 触发，CSS width transition（800ms，cubic-bezier ease-out）
- **交互动效**：纯 CSS transition（hover/focus 状态）
- **无需 GSAP**：本案动效较简单，原生 CSS + Intersection Observer 足以支撑，保持轻量

### 降级策略

- Canvas 水墨粒子：若 `window.matchMedia('(prefers-reduced-motion: reduce)').matches`，跳过 Canvas 初始化
- Intersection Observer：若不支持，所有元素直接显示（无动画）
- 表格：移动端 `overflow-x: auto` 横向滚动容器

---

## Tailwind 配置（供 Frontend 直接使用）

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'bg-base': '#F5EDD8',
        'bg-card': '#FDF8EE',
        'primary': '#8B1A2E',
        'primary-hover': '#6B1222',
        'accent': '#C49A44',
        'text-main': '#1E1A14',
        'text-muted': '#6B5D4A',
        'border-base': '#D4C4A0',
        'table-stripe': '#F0E8D4',
        'bg-footer': '#1E1A14',
        'text-footer': '#B0A080',
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'Georgia', 'serif'],
        'body': ['Lora', 'Georgia', 'serif'],
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.6s cubic-bezier(0.25,0.46,0.45,0.94) both',
        'barGrow': 'barGrow 0.8s cubic-bezier(0.25,0.46,0.45,0.94) both',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        barGrow: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--bar-width)' },
        }
      }
    }
  }
}
```

---

## 禁止事项

- 禁止：蓝紫渐变 hero
- 禁止：玻璃拟态（backdrop-filter blur 卡片）
- 禁止：极简纯白 + 无衬线体主字体（会破坏文学气质）
- 禁止：霓虹色或科技感色彩
- 禁止：把 Canvas 水墨层的透明度调高（会遮挡文字，适得其反）
- 禁止：所有元素使用相同的动画时长（会失去节奏感）
