# Design Brief — five-platform-payment-hub-710

## 1. Visual Theme & Atmosphere

**主题**：「多平台支付控制台档案室」— 深色中性底 + 每平台一条高饱和**窄色带**（非大面积渐变），强调**文档可读性**与**状态机清晰度**。氛围：冷静、可审计、略带终端感；拒绝营销风弥散渐变与卡通插画。

## 2. Color Palette & Roles（语义 + hex）

| Token | Hex | 角色 |
|-------|-----|------|
| `wdp.ink` | `#0c0f14` | 主背景 |
| `wdp.panel` | `#141a22` | 卡片表面 |
| `wdp.line` | `#2a3442` | 分隔线 |
| `wdp.text` | `#e8edf5` | 主文 |
| `wdp.muted` | `#8b98ab` | 次级说明 |
| `wdp.warn` | `#f0b429` | 过期/警示 |
| `wdp.ok` | `#3dd68c` | 成功 |
| `wdp.bad` | `#ff6b6b` | 失败/取消 |

**平台强调色（仅作左边框/小徽章，避免整屏染色）**：

- 美团系 `#22c55e`、京东系 `#e11d48`、拼多多系 `#f97316`、滴滴系 `#f59e0b`、携程系 `#38bdf8`。

OKLCH 备注（实现以 hex 为准）：面板约 `oklch(22% 0.02 250)`，正文约 `oklch(93% 0.02 250)`。

## 3. Typography Rules

**字体 CDN（固定 URL）**：

```text
https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;600;700&display=swap
```

| 层级 | 字体 | 桌面尺寸 | 行高 |
|------|------|----------|------|
| 平台主标题 | Noto Sans SC 600 | 28–32px | 1.25 |
| 区块标题 | Noto Sans SC 600 | 20–22px | 1.3 |
| 正文 | Noto Sans SC / IBM Plex Sans 400 | ≥18px（主段落 20–24px） | 1.55 |
| 数据/单号 | IBM Plex Sans 500 | 16–18px | 1.4 |
| 角标/标签 | 同正文 500 | 12–13px | 1.35 |

## 4. Component Stylings

- **平台切换**：横向 `scroll` + `gap`；选中态 2px 底边 + 略提亮文字；`min-h-[44px] min-w-[44px]` 触控；`role=tab` 带 `aria-controls` 指向单一 `tabpanel`（订单+矩阵容器）。
- **信息条幅**：**顶缘** 3px 平台色渐变条（非左侧竖条），内文文档体短段落；与面板圆角对齐。
- **订单卡**：订单号、应付金额、倒计时条（过期）、状态 `badge`（圆角 pill）；表面采用**竖向 ledger 细线**（票据对账栅格）+ 底缘**齿孔虚线**（`wdp-order-ticket`），右上角 `存根 · stub` 为纯装饰（`aria-hidden`），强化「收银票据存根」隐喻且不与正文抢读。
- **能力矩阵**：2×3 到 1×6 响应式网格；每格 icon + 标题 + 一行说明；`hover`/`focus` 抬升 `translate-y` 2px，时长 180ms；外层 `wdp-clause-deck` 为**极淡斜向安全纹 + 条款纸边**（与订单票据同卷宗语汇，不压暗矩阵对比度）。
- **详情抽屉**：矩阵点击后在卡下方展开 `region`；收起时 **清空内容** 并 `aria-hidden=true`，避免辅助技术读到已隐藏文案。

## 5. Layout Principles

- **8pt 基线**：间距取 8、12、16、24、32、48。
- **Grid**：主内容 `max-w-5xl` 居中；矩阵 `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`。
- **留白**：段落 `max-w-prose`；避免满宽长行。

## 6. Depth & Elevation

- 卡片：`box-shadow: 0 18px 50px rgba(0,0,0,0.35)`；边框 `1px solid rgba(255,255,255,0.06)`。
- 悬浮格：`shadow-lg` + 边框略亮；无多层模态堆叠（保持单页原型）。

## 7. Do's and Don'ts

**Do**：文档体标题（「1. 范围」「2. 状态定义」）；状态与操作可逆（演示用重置）；键盘可操作。

**Don't**：Inter/Roboto 默认栈；紫粉大面积 hero；假统计数字；未说明占位的外链指向真实金融域名。

**动效阶梯**：120ms（hover 色）/ 240ms（展开）/ 400ms（页面切换淡入）。尊重 `prefers-reduced-motion: reduce`。

## 8. Responsive Behavior

- 断点：`sm` 640 / `lg` 1024。
- 移动：平台切换可横向滑动；矩阵单列；订单金额与按钮全宽。
- 触控目标 ≥44×44px。

## 9. Agent Prompt Guide（快览）

- **主背景**：`#0c0f14`；**面板**：`#141a22`；**主文**：`#e8edf5`。
- **字体**：Noto Sans SC + IBM Plex Sans（上述 Google Fonts URL）。
- **禁忌**：Generic 紫渐变、Inter、假 KPI、未授权品牌 Logo。

---

## 设计问题陈述

如何在**一个静态单文件**内，让五套「看起来像不同平台」的模板**共享同一信息架构**，又不沦为五张换皮截图？解法：**统一骨架**（条幅—切换—订单卡—矩阵—详情），**以窄色带 + 标题文案 + 微文案**区分平台；矩阵承载用户给定的六列能力，映射为可点的「条款条目」。

## 页面交互清单（Evaluator）

- [ ] 五平台切换更新：主标题、`document.title`、条幅强调色、订单示例文案。
- [ ] 矩阵六项均可聚焦与点击；展开/收起详情；`aria-expanded` 正确。
- [ ] 支付状态可在「待支付 / 处理中 / 成功 / 失败」间切换（演示按钮或矩阵联动）。
- [ ] 订单过期倒计时可走满并触发「已过期」状态；提供重置。
- [ ] 「跳转官网」打开新窗口占位链接，含 `rel="noopener noreferrer"`。
- [ ] 无阻断性控制台错误；移动端布局无重叠。

## 视觉特效方案

- **本 case**：纯 CSS（渐变噪点 optional、`backdrop-blur` 轻量）；**不引入**额外 JS 视觉库，保证单文件与加载稳定。
- **CDN**：Tailwind Play CDN `https://cdn.tailwindcss.com`（与仓库内既有 case 对齐；生产环境应换构建链路）。

## 分型与变体

| 轴 | 说明 |
|----|------|
| `--wdp-radius` | 卡片圆角 12–20px |
| `--wdp-density` | `1` 正常 / `0.85` 紧凑（padding 缩放） |
| `--wdp-accent` | 当前平台强调色（由 JS 写入 `:root`） |

调试：`?debug=1` 在控制台打印当前平台 key 与状态机快照。

## Tailwind 配置（片段）

```js
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wdp: {
          ink: '#0c0f14',
          panel: '#141a22',
          line: '#2a3442',
          text: '#e8edf5',
          muted: '#8b98ab',
          warn: '#f0b429',
          ok: '#3dd68c',
          bad: '#ff6b6b'
        }
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Sans"', 'ui-monospace', 'monospace']
      }
    }
  }
};
```

## 前端交付

本 case 为 **`single_html`**：`02-build/index.html` 单文件，与 `case-manifest.json` 的 `frontend_deliverable` 一致。
