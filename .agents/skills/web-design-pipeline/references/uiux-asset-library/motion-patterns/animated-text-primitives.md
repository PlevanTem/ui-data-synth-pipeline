# Animated Text Primitives

**资产类型**: motion-pattern  
**适用场景**: landing page hero 区、SaaS 品牌标题、AI 产品叙事、滚动驱动内容  
**交互等级**: `medium | high`  
**更新日期**: 2026-03

---

## 核心概念

文字动效不是装饰，而是"信息出现方式"本身。好的文字动效应：
1. 强化阅读顺序（视线引导）
2. 建立品牌节奏感（快/慢/弹/顺滑）
3. 区分主次层级（标题 vs 副标题 vs body 有不同节奏）
4. 适配内容语义（AI = 流式；品牌 = 庄重慢入；游戏 = 爆发性）

---

## 文字动效原语分类

### 1. 出现型（Entrance）

| 效果名 | 视觉描述 | 来源库 | 适用语境 |
|---|---|---|---|
| **Blur Fade** | 从模糊+透明淡入清晰 | MagicUI `blur-fade` | 几乎所有内容区，通用且精致 |
| **Fade Content** | 向上滑动淡入 | ReactBits `FadeContent` | 滚动触发的内容区块 |
| **Word Rotate** | 关键词轮流替换 | MagicUI `word-rotate` | Hero 标题动态概念词 |
| **Text Animate** | 逐词/逐字淡入，可编排顺序 | MagicUI `text-animate` | 多段落分层入场 |
| **SplitText** | 字符逐一弹入 | ReactBits `SplitText` | 短标题的戏剧性出场 |

### 2. 变形型（Morphing）

| 效果名 | 视觉描述 | 来源库 | 适用语境 |
|---|---|---|---|
| **Morphing Text** | 词与词之间的粒子级变形 | MagicUI `morphing-text` | AI 产品"能力词"循环展示 |
| **Hyper Text** | 鼠标悬停时字符乱码后还原 | MagicUI `hyper-text` | 开发者工具、Sci-Fi 风格 |
| **Text Pressure** | 鼠标接近时字体粗细随距离变形 | ReactBits `TextPressure` | 交互型 hero，强调"可感知" |
| **Aurora Text** | 文字填充极光渐变色彩流动 | MagicUI `aurora-text` | 高端品牌、AI 视觉实验 |

### 3. 数字型（Counting）

| 效果名 | 视觉描述 | 来源库 | 适用语境 |
|---|---|---|---|
| **Number Ticker** | 数字从 0 滚动到目标值 | MagicUI `number-ticker` | 统计数据、成就指标 |
| **CountUp** | 类似 NumberTicker，可设 easing | ReactBits `CountUp` | dashboard、数据落地页 |

### 4. 流式型（Streaming / Scroll）

| 效果名 | 视觉描述 | 来源库 | 适用语境 |
|---|---|---|---|
| **Text Reveal** | 随滚动逐词高亮解锁 | MagicUI `text-reveal` | 长文叙事、品牌 manifesto |
| **Scroll Based Velocity** | 文字跑马灯速度随滚动速率变化 | MagicUI `scroll-based-velocity` | 品牌名/关键词横向流动展示 |
| **Streaming Text Reveal** | 逐字符打印，模拟 AI 流式输出 | 自写 / 参考资产库 | AI 对话产品、演示界面 |

### 5. 点缀型（Decorative）

| 效果名 | 视觉描述 | 来源库 | 适用语境 |
|---|---|---|---|
| **Sparkles Text** | 文字附近随机出现闪烁星光 | MagicUI `sparkles-text` | 促销、Premium CTA |
| **Animated Gradient Text** | 文字填充流动渐变 | MagicUI `animated-gradient-text` | 品牌名、标语高亮 |
| **Animated Shiny Text** | 光泽扫过文字 | MagicUI `animated-shiny-text` | 提示标签、新功能 badge |
| **Line Shadow Text** | 投影随光方向变化 | MagicUI `line-shadow-text` | 大标题、editorial 风格 |
| **Video Text** | 视频画面填充文字内轮廓 | MagicUI `video-text` | 品牌站大标题，视觉冲击强 |
| **Comic Text** | 描边漫画风格文字 | MagicUI（community）| 游戏、潮牌、轻松品牌 |
| **Spinning Text** | 文字绕圆形旋转 | MagicUI `spinning-text` | 印章感装饰、Circular badge |

---

## 组合策略

### 策略 A：层级入场编排
```
Hero 标题 → Blur Fade（主标题先入，慢）
副标题 → Text Animate word by word（稍晚，逐词）
CTA 按钮 → Fade Content（最后，向上淡入）
```
适用：品牌站、SaaS landing page

### 策略 B：动态关键词循环
```
"We help [Word Rotate: startups / teams / enterprises]"
```
适用：产品 hero，展示多受众定位

### 策略 C：滚动叙事
```
正文段落 → Text Reveal（随滚动逐词解锁）
统计数据 → Number Ticker（进入视口触发）
关键词横向流 → Scroll Based Velocity（装饰层）
```
适用：品牌故事页、About 页面

### 策略 D：AI 产品特效
```
能力词展示 → Morphing Text（循环变形）
输出模拟 → Streaming Text Reveal（打字机流式）
标题 → Aurora Text 或 Animated Gradient Text
技术指标 → Number Ticker
```
适用：AI 工具产品落地页

---

## 实现注意事项

```typescript
// 1. 所有入场动效必须与 IntersectionObserver 结合
// 不要在页面加载时就播放所有动效，用户看不到的区域不触发

// 2. 节奏控制（delay stagger）
// 同一区块内多个元素应有 50-150ms 的阶梯延迟，而不是全部同时出现

// 3. prefers-reduced-motion 必须兼容
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// MagicUI / ReactBits 大多数组件已内置此检查

// 4. 文字动效不要全页面使用
// 每个页面只有 1-2 处核心动效点（hero + 1 个关键 section）
// 其余区域使用简单的 Blur Fade 即可

// 5. MagicUI 安装（通过 MCP 或 CLI）
// npx shadcn@latest add text-animate
// npx shadcn@latest add blur-fade
// 或通过 MagicUI MCP：npx @magicuidesign/mcp@latest
```

---

## 反模式 / 避免事项

- 整个页面所有文字都有动效 → 视觉噪音，失去注意力引导
- 同一视口内 5+ 个不同动效同时触发 → 混乱感
- 数字滚动 CountUp 在 hero 区用于装饰性数字 → 廉价感
- 只用打字机效果就宣称"AI 风" → 2023 年的陈词滥调
- Sparkles Text 用于非促销内容 → 喧宾夺主

---

## 结构化标签（资产互通）

```json
{
  "style_keywords": ["animated-text", "text-motion", "entrance-animation", "scroll-driven", "morphing"],
  "interaction_level": "medium",
  "visual_primitives": ["typography", "motion", "fade", "blur", "gradient"],
  "motion_primitives": ["fade-in", "blur-fade", "word-rotate", "morph", "scroll-sync", "stagger", "number-ticker"],
  "implementation_hints": ["Framer Motion", "CSS animation", "IntersectionObserver", "GSAP", "MagicUI", "ReactBits"],
  "uiuxmax_domains": ["typography", "landing", "style", "prompt"],
  "suitable_stacks": ["react", "nextjs", "vue", "svelte"],
  "avoid_patterns": ["全页面动效", "多动效同屏竞争", "打字机滥用", "CountUp 装饰性使用"]
}
```
