# 聚焦决策 SFT 样本输出模板

实际输出为 JSONL（见 SKILL.md schema），此模板用于人工审核和示意。一个 case 输出 3-5 条 samples，以下为参考示例（非固定约束）。

---

## User（所有 sample 共享）

帮我设计一个国际协作诗歌节的票务/邀请页面。这是一场多国诗人联合朗诵的文化活动，有活动介绍、日期场地、票价分区、评审阵容、奖项说明，还有报名按钮。希望视觉上有文学气质，有氛围感，不要做成普通电商购票页那种冷冰冰的样子。用 HTML + Tailwind 做就好。

---

## Sample 1: 视觉方向选择

### Assistant

```
<think>
让我想想这个诗歌节页面的视觉方向。先从需求里找线索——"国际协作诗歌节"，有多国诗人，有评审和奖项，在晚间举行。用户希望有文学气质，不要冷冰冰。

情绪关键词是什么？文学性、仪式感、夜晚、沉浸感。带着这几个词来想方向。

第一个：白底书卷感。米白底色，衬线字体，大留白。优雅克制，有翻阅诗集的感觉。但等等——这个活动是晚间活动，白底跟"夜"的基调有根本性冲突。而且活动页需要让人产生"想去"的冲动，白底太克制了，视觉张力不够。

第二个：现代主义拼贴风。高饱和大色块，强烈几何分割，无衬线大标题。视觉冲击力强，适合先锋音乐节。但跟"诗歌"的严肃文学气质有点偏——如果评审阵容里有知名诗人，这种海报风格会让活动看起来不够庄重。放弃。

第三个：深色氛围感。暗底（深海蓝），手写感衬线字体，金色点缀，营造"深夜、朗诵台灯光"的氛围。这个方向和"诗歌之夜"高度契合——暗色背景让文字真的"发光"，符合诗歌"点亮语言"的意向。

就走深色氛围感。信息密集区用 glassmorphism 半透明卡片保证可读性，这个问题可以在实现层面解决。
</think>

视觉方向定为深色氛围感，Hero 和整体基调如下：

```html
<!-- Hero section — 深色氛围感基调 -->
<style>
  :root {
    --bg-deep: #0A0E1A;
    --text-primary: #F0EBE0;
    --accent-gold: #D4A843;
  }
  body { background-color: var(--bg-deep); color: var(--text-primary); }
  h1, h2, h3 { font-family: 'Playfair Display', serif; }
</style>

<section class="flex flex-col items-center justify-center min-h-screen text-center px-6 py-24">
  <p class="text-sm tracking-[0.3em] uppercase mb-6" style="color: var(--accent-gold)">
    April 18–20, 2026 · Shanghai
  </p>
  <h1 class="text-5xl md:text-7xl font-bold italic leading-tight mb-6">
    International<br/>Poetry Slam
  </h1>
  <p class="text-lg max-w-2xl mx-auto italic" style="color: #8A8FA8;">
    Where language meets the edge of silence.
  </p>
</section>
```
```

---

## Sample 2: 配色系统决策

### Assistant

```
<think>
视觉方向定了是深色氛围感，来想具体配色。

背景色怎么选？第一反应是纯黑。但纯黑 #000000 在屏幕上会显得廉价，有盗版网站的既视感。文学活动需要高级感，背景色要有一点色彩倾向。

往蓝色走——深海蓝 #0A0E1A，带着宇宙感和深邃感，比纯黑多了一层视觉厚度，和"探索语言边界"的气质匹配。

主文字色不用纯白。纯白对比太强，长时间阅读会刺眼。用 #F0EBE0（偏暖的奶白），对比度足够，还和诗集纸张的米白色有联想感。

强调色选金黄 #D4A843——因为活动有评审和奖项，金色有荣誉感，配深海蓝是经典夜空配色，稳定好看。CTA 按钮用暖橘 #E87C5A，比纯红温暖，和文学气质更搭。

辅助文字 #8A8FA8（蓝灰中性），边框线 rgba(212, 168, 67, 0.2)——金色但低透明度，分隔而不喧宾夺主。
</think>

配色系统的 CSS 变量声明：

```html
<style>
  :root {
    /* 背景层 */
    --bg-deep: #0A0E1A;          /* 深海蓝主背景 */
    --bg-card: rgba(255, 255, 255, 0.05); /* glassmorphism 卡片底色 */

    /* 文字层 */
    --text-primary: #F0EBE0;     /* 偏暖奶白，主要正文 */
    --text-muted: #8A8FA8;       /* 蓝灰中性，辅助说明文字 */

    /* 强调色 */
    --accent-gold: #D4A843;      /* 金黄，标题/强调/奖项 */
    --accent-warm: #E87C5A;      /* 暖橘，CTA 按钮 */

    /* 边框 */
    --border-subtle: rgba(212, 168, 67, 0.2); /* 金色描边，低调分隔 */
  }
</style>
```
```

---

## Sample 3: 字体系统选择

### Assistant

```
<think>
字体是这个页面气质的关键载体，需要认真想。

几个选项摆在面前——无衬线现代字体，比如 Inter 或 DM Sans。简洁、可读性强，但对于诗歌节来说太"产品化"了，少了文学的温度感。

衬线字体有两类选择。一类是 Times New Roman 这种经典衬线——太正式、太学术，像教科书，不像邀请函。另一类是有设计感的现代衬线，比如 Playfair Display——它有19世纪印刷体的优雅感，斜体特别迷人，很适合做诗歌标题和作者名字。

嗯，Playfair Display 的斜体做 Hero 标题，这个感觉对了。但正文用 Playfair Display 会有点累——字符太有个性，大段落阅读体验会下降。配一个可读性更强的衬线体做正文——Lora，同属衬线系，但设计更克制，段落阅读体验好。

标题 Playfair Display + 正文 Lora，都是衬线系，调性统一，但粗细和结构有差异，形成层次感而不单调。两个字体在 Google Fonts 上都有，CDN 引入成本极低。
</think>

字体引入与应用规则：

```html
<!-- Google Fonts 引入 -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />

<style>
  /* 字体系统 */
  body { font-family: 'Lora', serif; }           /* 正文：可读性强的衬线体 */
  h1, h2, h3 { font-family: 'Playfair Display', serif; } /* 标题：有印刷感的优雅衬线体 */

  /* 典型应用 */
  .hero-title { font-style: italic; font-weight: 700; }  /* Hero 斜体粗标题 */
  .section-title { font-style: italic; font-weight: 400; } /* 区块标题，斜体常规重 */
  .body-text { font-weight: 400; line-height: 1.8; }     /* 正文舒适行距 */
  .label-text { font-family: 'Lora', serif; letter-spacing: 0.1em; } /* 小标签 */
</style>
```
```

---

## Sample 4: 版式骨架决策

### Assistant

```
<think>
版式骨架要想清楚两件事：信息的叙事顺序，和空间的节奏感。

叙事顺序：用户打开页面，第一眼应该被情绪打动，而不是被票价轰炸。所以骨架是——情绪先行（Hero 全屏）→ 活动介绍（建立认知）→ 嘉宾/评审（建立信任）→ 票价（触发决策）→ 奖项（强化价值）→ CTA（引导行动）。如果把票价放在第一屏，会让活动感觉太功利。

空间节奏：Hero 全屏高度（100vh），给情绪充分的呼吸空间，不要在首屏就塞信息。各 section 之间的 padding 要慷慨——py-20（80px），避免信息密铺的廉价感。最大宽度 max-w-5xl 居中，两侧留白让内容有聚焦感。

票价区用三列卡片还是表格？表格更高效，信息密度高。但表格在视觉上很"功能性"，和整体文学氛围格格不入。三列 glassmorphism 卡片更有活动感，也方便突出"Full Pass"这个推荐档位（用金色边框）。

嘉宾/评审用卡片网格——2列（移动端）到4列（桌面端），简洁对称，不要花哨。
</think>

版式骨架的 HTML 结构：

```html
<!-- 版式骨架 —— 叙事顺序 + 空间节奏 -->
<body class="min-h-screen" style="background: #0A0E1A;">

  <!-- 情绪先行：Hero 全屏 -->
  <section class="flex flex-col items-center justify-center min-h-screen text-center px-6 py-24">
    <!-- 标题 + slogan + CTA -->
  </section>

  <!-- 认知建立：活动介绍 -->
  <section class="max-w-3xl mx-auto px-6 py-20">
    <!-- 段落文字 -->
  </section>

  <!-- 信任背书：嘉宾/评审 -->
  <section class="max-w-5xl mx-auto px-6 py-20">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <!-- 卡片网格 -->
    </div>
  </section>

  <!-- 决策触发：票价 -->
  <section class="max-w-4xl mx-auto px-6 py-20" id="tickets">
    <div class="grid md:grid-cols-3 gap-6">
      <!-- glassmorphism 三列卡片 -->
    </div>
  </section>

  <!-- 价值强化：奖项 + 页脚 CTA -->
  <section class="max-w-3xl mx-auto px-6 py-20 text-center">
    <!-- 奖项说明 -->
  </section>

</body>
```
```

---

## Sample 5: 视觉特效方案

### Assistant

```
<think>
背景效果是这个页面的氛围放大器，但不能喧宾夺主。

几个方案想一想——WebGL 粒子系统（Three.js 或 raw WebGL）。效果最炫，可以做出很复杂的流体感或星云感。但这是一个活动页，不是技术演示，引入 Three.js 会让页面依赖变重，在性能差的设备上帧率会下降，而且 Three.js 对一个粒子背景来说完全 overkill。

CSS animation 纯粹。可以用 @keyframes 做浮动元素或渐变动效，零 JS 依赖。但 CSS animation 的动效比较机械，缺少有机的随机感，粒子的随机位置和漂移轨迹 CSS 很难做自然。

Canvas 2D + 原生 JS。可以做随机位置、随机速度、随机透明度的粒子漂移，代码量 100-150 行，无框架依赖，性能可控。粒子数量控制在 60-80 个，半径 0.3-1.5px，漂移速度 0.1-0.15px/frame——要像背景里的"呼吸"，不能太动。金色 rgba(212, 168, 67, 0.2-0.5) 透明度范围，若隐若现，配合深海蓝背景营造星空感。

降级策略：如果 Canvas 不支持，直接退化到纯色背景（var(--bg-deep)），不影响内容可读性。

就用 Canvas 2D。设置 z-index: 0，pointer-events: none，保证不干扰内容交互。
</think>

Canvas 粒子背景实现：

```html
<canvas id="bg" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; opacity: 0.4;"></canvas>

<script>
  (function () {
    const canvas = document.getElementById('bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // 降级：Canvas 不支持直接退出，背景色兜底

    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    window.addEventListener('resize', () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });

    const COUNT = 75;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.14, vy: (Math.random() - 0.5) * 0.14,
      alpha: Math.random() * 0.4 + 0.15
    }));

    function tick() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 168, 67, ${p.alpha})`;
        ctx.fill();
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
      });
      requestAnimationFrame(tick);
    }
    tick();
  })();
</script>
```
```

---

## Sample 6: 功能边界（negative 极性）

### Assistant

```
<think>
用户说要"报名"和"购票"，但让我想清楚这要做到什么程度。

这是一个展示型的活动票务页——单文件 HTML，无后端，无服务器。如果要做真实支付，需要支付 SDK（微信/支付宝）、用户认证、订单系统、后端 API——这些全是后端工程的范畴，远超"做一个活动页"的边界，也根本不是前端单文件能实现的。

所以报名/购票按钮做成 CTA 跳转——href 指向一个假设的外部报名链接（如腾讯文档表单或第三方票务平台链接）。按钮该有的视觉状态（hover 光晕、active 下压）都完整实现，用户体验上是完整的，只是不真实完成支付流程。

同理，嘉宾/评审阵容用 mock 数据——真实姓名和简介在没有活动方提供的情况下用有说服力的虚构内容替代。不接任何外部 API，不做动态加载。

这个决定让页面保持零依赖、浏览器直接打开可运行，完全达成展示目标。
</think>

CTA 按钮与 mock 数据的处理方式：

```html
<!-- 购票 CTA：跳转外部链接，不做真实支付 -->
<a href="https://example-ticketing-platform.com/poetry-slam-2026"
   target="_blank" rel="noopener"
   class="glow-btn px-10 py-4 rounded-full text-sm tracking-widest uppercase font-medium"
   style="background: var(--accent-warm); color: #fff;">
  Get Tickets
</a>

<!-- 嘉宾/评审 mock 数据（JS 渲染） -->
<script>
  const JUDGES = [
    { name: 'Mei Liánhuā', country: 'China', bio: 'Award-winning poet, National Literature Prize 2022' },
    { name: 'Aiko Tanaka',  country: 'Japan', bio: 'Spoken word artist, Tokyo Poetry Slam champion' },
    { name: 'Lars Eriksen', country: 'Sweden', bio: 'Author of three collections, Nordic Council nominee' },
    { name: 'Amara Osei',   country: 'Ghana', bio: 'Performance poet, TEDx speaker, Accra Literary Festival' },
  ];
  // 渲染到 #judges-grid
</script>
```
```

---

## 反面示例

### ❌ user prompt 被拆成具体技术问题

```json
{
  "conversations": [
    { "role": "user", "content": "为什么选择深色主题？" }
  ]
}
```

问题：user prompt 应该始终是原始完整需求，不应拆成具体设计问题。模型应当学习「从完整需求自动聚焦到具体决策」。

### ❌ `<think>` 直接给结论无推理过程

```
<think>
配色用深色系，背景 #0A0E1A，强调色金黄，CTA 暖橘。
</think>
```

问题：直接结论，无发散过程，无否定推理，无犹豫权衡。

### ❌ 每条 sample 代码包含完整 index.html

问题：causal-chain 的代码输出应只包含与该决策相关的片段（对应 CSS 变量/HTML section/JS 函数），不是全文件。完整源码应在 long-chain 样本中输出。
