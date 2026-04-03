# 长链推理 SFT 样本输出模板

实际输出为 JSONL（见 SKILL.md schema），此模板用于人工审核和示意。

---

## 完整样本示意（不要完全照搬）

### User

帮我设计一个国际协作诗歌节的票务/邀请页面。这是一场多国诗人联合朗诵的文化活动，有活动介绍、日期场地、票价分区、评审阵容、奖项说明，还有报名按钮。希望视觉上有文学气质，有氛围感，不要做成普通电商购票页那种冷冰冰的样子。用 HTML + Tailwind 做就好。

### Assistant

```
<think>
让我先理解一下这个需求的本质。这不是一个功能性购票页——它更像是一张邀请函，或者说一张海报。用户打开这个页面，首先要被打动，觉得"这个活动很特别，我想去"，然后才是找票价、点报名。信息层级应该是：情绪先行 → 活动介绍 → 嘉宾/评审 → 票价 → 报名 CTA。

这是一个国际协作的诗歌节。"国际协作"意味着多语言、多文化交汇；"诗歌"意味着文学性、艺术性；"节"意味着有仪式感和庆典感。用户画像：可能是诗歌爱好者，可能是文学圈的人，也可能是被海报吸引来看看的普通人——但他们共同的期待是"这个活动看起来很有品质"。

页面结构大概是：大尺寸 Hero（活动名 + 日期地点 + slogan）→ 活动介绍段落 → 嘉宾/评审阵容 → 票价分区表 → 奖项说明 → 报名 CTA → 页脚。这是文化活动页的标准骨架，没什么争议，但视觉风格的选择才是真正的差异化所在。

好，来想视觉方向。三个方向在脑子里浮现——

第一个：白底书卷感。米白 #FAF8F4 底色，大量衬线字体，用留白和排版节奏营造"翻阅诗集"的阅读体验。这个方向优雅、克制，适合偏学术气质的活动。但问题是它不够"夜"——这是一场晚间朗诵活动，白底方案会让人感觉像大白天的书展，少了那种诗歌之夜独有的沉浸感和紧张感。而且白底在信息量多的时候会显得普通，很难做出让人有冲动买票的页面。

第二个：现代主义拼贴风。大字号无衬线标题，强烈的几何分割，高饱和的单色大色块（比如全版酱红或深绿）。视觉冲击力够，时髦感强。但等等——这个审美跟"诗歌"的气质有点偏。它更像艺术装置展或先锋音乐节的海报，而不是一场有文学底蕴的诗歌节。如果评审阵容里有严肃诗人，这种风格会让他们觉得活动不够庄重。放弃这个方向。

第三个：深色氛围感。暗底（近黑或深海蓝），手写感衬线字体做标题，金色或暖橘色作为发光点缀，整体营造出"深夜、灯光、朗诵台"的氛围。这个思路很对——"夜"是这个活动天然的视觉基调，暗色背景能让诗句和名字在视觉上"发光"，而且这种氛围感会让用户觉得自己在打开一封邀请函，而不是在浏览购物页面。

嗯，走深色氛围感。但深色方案有个具体问题需要解决：票价表这种信息密集的区域，在暗底上怎么保证可读性？纯色文字在深底上对比度需要足够，或者用半透明卡片做分隔层——glassmorphism 的毛玻璃效果在这里会很自然，既保持暗色调性，又让信息区有清晰感。这个问题可以处理。

具体到颜色：背景用 #0A0E1A（深海蓝，不是纯黑——纯黑有廉价感，深海蓝有深邃感）；卡片/内容区用 rgba(255,255,255,0.05) 半透明白；强调色选金黄 #D4A843（呼应奖项、荣誉、诗歌印刷体的金边），还有暖橘 #E87C5A 作为 CTA 按钮色（比纯红更温暖，和文学气质更搭）。

字体这块很关键，决定整个页面的气质。标题用 Playfair Display 斜体——它有19世纪印刷体的优雅感，特别适合诗歌标题和作者名字；正文配 Lora，同属衬线系但可读性更强，适合段落和说明文字。英文标题和中文内容的搭配...如果页面以英文为主，Playfair + Lora 足够了。

等等，背景效果怎么做？纯色背景太静，加一点动态感会更有沉浸感。Canvas 粒子效果是个选项——小白点缓慢漂移，像舞台上的微尘或夜空的星点。不能太密、不能太快，要像背景里的呼吸感，不能抢 Hero 文字的视觉焦点。Canvas 2D 就够了，不需要 WebGL——粒子逻辑简单，Three.js 完全 overkill。CSS animation 做主要的 section 渐入效果，Canvas 只做背景层。

技术上单文件 HTML + Tailwind CDN，Tailwind 覆盖所有布局，自定义 CSS 变量管理颜色 token，Canvas 用原生 JS 写，200 行以内搞定粒子背景。

最终决定收拢一下：深海蓝主题（#0A0E1A 背景），Playfair Display + Lora 字体组合，金黄色 #D4A843 强调，暖橘 #E87C5A CTA，Canvas 星点粒子背景，glassmorphism 卡片用于信息密集区，滚动视差 + section 渐入动效。

交互三个重点：Hero 标题的 typewriter 效果（逐字显示，"正在书写诗句"的感觉）；报名按钮的 hover 光晕扩散；各 section 滚动进入时的 opacity + translateY 渐入。
</think>

好的，我来为你实现这个诗歌节票务页面。

```html
<!-- poetry-slam-ticket@v5_20260402/03_frontend/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>International Collaborative Poetry Slam 2026</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg-deep: #0A0E1A;
      --bg-card: rgba(255, 255, 255, 0.05);
      --accent-gold: #D4A843;
      --accent-warm: #E87C5A;
      --text-primary: #F0EBE0;
      --text-muted: #8A8FA8;
      --border-subtle: rgba(212, 168, 67, 0.2);
    }
    body { background-color: var(--bg-deep); color: var(--text-primary); font-family: 'Lora', serif; }
    h1, h2, h3 { font-family: 'Playfair Display', serif; }
    canvas#bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; opacity: 0.4; }
    .glass-card { background: var(--bg-card); backdrop-filter: blur(12px); border: 1px solid var(--border-subtle); }
    .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.8s ease, transform 0.8s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .glow-btn { box-shadow: 0 0 0 0 rgba(232, 124, 90, 0.4); transition: box-shadow 0.3s ease, transform 0.2s ease; }
    .glow-btn:hover { box-shadow: 0 0 24px 8px rgba(232, 124, 90, 0.35); transform: translateY(-2px); }
  </style>
</head>
<body class="min-h-screen">
  <canvas id="bg"></canvas>

  <!-- Hero -->
  <section class="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 py-24">
    <p class="text-sm tracking-[0.3em] uppercase mb-6" style="color: var(--accent-gold)">April 18–20, 2026 · Shanghai</p>
    <h1 class="text-5xl md:text-7xl font-bold italic leading-tight mb-6" style="color: var(--text-primary)">
      <span id="typewriter"></span><span class="animate-pulse">|</span>
    </h1>
    <p class="text-lg md:text-xl max-w-2xl mx-auto mb-10" style="color: var(--text-muted); font-style: italic;">
      Where language meets the edge of silence. Twelve poets, six nations, three nights.
    </p>
    <a href="#tickets" class="glow-btn px-10 py-4 rounded-full text-sm tracking-widest uppercase font-medium" style="background: var(--accent-warm); color: #fff;">
      Get Tickets
    </a>
  </section>

  <!-- About -->
  <section class="relative z-10 max-w-3xl mx-auto px-6 py-20 reveal">
    <h2 class="text-3xl md:text-4xl italic mb-8" style="color: var(--accent-gold)">About the Event</h2>
    <p class="text-base leading-relaxed mb-4" style="color: var(--text-muted)">
      The International Collaborative Poetry Slam brings together 12 acclaimed poets from across Asia, Europe, and the Americas for an evening of performance, dialogue, and creative collision. Each night features bilingual readings, live improvisation, and a judged slam round.
    </p>
    <p class="text-base leading-relaxed" style="color: var(--text-muted)">
      Hosted at the historic Yuz Museum in Shanghai's West Bund arts district, the event spans three evenings and culminates in the Grand Slam Finals on April 20th.
    </p>
  </section>

  <!-- Judges -->
  <section class="relative z-10 max-w-5xl mx-auto px-6 py-20 reveal">
    <h2 class="text-3xl md:text-4xl italic mb-12 text-center" style="color: var(--accent-gold)">Judges & Featured Poets</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <!-- ... judge cards ... -->
    </div>
  </section>

  <!-- Tickets -->
  <section id="tickets" class="relative z-10 max-w-4xl mx-auto px-6 py-20 reveal">
    <h2 class="text-3xl md:text-4xl italic mb-12 text-center" style="color: var(--accent-gold)">Tickets & Pricing</h2>
    <div class="grid md:grid-cols-3 gap-6">
      <div class="glass-card rounded-2xl p-8 text-center">
        <p class="text-xs tracking-widest uppercase mb-3" style="color: var(--text-muted)">General</p>
        <p class="text-4xl font-bold mb-1" style="color: var(--text-primary)">¥280</p>
        <p class="text-sm mb-6" style="color: var(--text-muted)">Single night entry</p>
        <a href="#" class="glow-btn block px-6 py-3 rounded-full text-sm uppercase tracking-wider" style="background: var(--accent-warm); color: #fff;">Book Now</a>
      </div>
      <div class="glass-card rounded-2xl p-8 text-center border-2" style="border-color: var(--accent-gold)">
        <p class="text-xs tracking-widest uppercase mb-3" style="color: var(--accent-gold)">Full Pass</p>
        <p class="text-4xl font-bold mb-1" style="color: var(--accent-gold)">¥680</p>
        <p class="text-sm mb-6" style="color: var(--text-muted)">All three nights</p>
        <a href="#" class="glow-btn block px-6 py-3 rounded-full text-sm uppercase tracking-wider" style="background: var(--accent-gold); color: #0A0E1A;">Best Value</a>
      </div>
      <div class="glass-card rounded-2xl p-8 text-center">
        <p class="text-xs tracking-widest uppercase mb-3" style="color: var(--text-muted)">Patron</p>
        <p class="text-4xl font-bold mb-1" style="color: var(--text-primary)">¥1,280</p>
        <p class="text-sm mb-6" style="color: var(--text-muted)">VIP + meet & greet</p>
        <a href="#" class="glow-btn block px-6 py-3 rounded-full text-sm uppercase tracking-wider" style="background: var(--accent-warm); color: #fff;">Book Now</a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="relative z-10 text-center py-12 px-6" style="color: var(--text-muted); border-top: 1px solid var(--border-subtle);">
    <p class="italic text-sm">Poetry is the spontaneous overflow of powerful feelings — Wordsworth</p>
    <p class="text-xs mt-3 tracking-wider uppercase">© 2026 International Poetry Slam Foundation</p>
  </footer>

  <script>
    // Canvas particle background
    const canvas = document.getElementById('bg');
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 80; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3, vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.5 + 0.2 });
    }
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 168, 67, ${p.alpha})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();

    // Typewriter
    const title = 'International\nPoetry Slam';
    const el = document.getElementById('typewriter');
    let i = 0;
    function type() {
      if (i < title.length) {
        el.innerHTML += title[i] === '\n' ? '<br/>' : title[i];
        i++;
        setTimeout(type, i < 14 ? 80 : 60);
      }
    }
    setTimeout(type, 600);

    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    reveals.forEach(r => observer.observe(r));
  </script>
</body>
</html>
```
```

---

## 反面示例（不应该这样写）

### ❌ 只谈技术栈不谈设计感知

```
<think>
技术栈选择 React 还是 Vue？这个需求用 HTML + Tailwind 就够了，不需要框架。
Canvas 用原生 JS，Tailwind CDN 引入。然后需要一个 hero section，一个 tickets section。
颜色用深色系，字体用 Google Fonts。
</think>
```

问题：完全没有设计思维。没有从需求出发推导视觉方向，没有对视觉方案的比较和筛选，没有配色逻辑，没有字体选择的理由。结论堆砌，毫无推理过程。

### ❌ 结构化报告风格

```
<think>
## 阶段一：需求分析

**核心问题**：用户需要票务页面。

**目标用户**：
- 诗歌爱好者
- 文化活动参与者

**页面区块**：
- Hero
- 票价
- 嘉宾
</think>
```

问题：markdown 标题、列表嵌套、模板感——这是报告，不是心理独白。

### ❌ JSON 字段名泄露

```
<think>
从 design_brief.md 的 color_palette.rationale 字段看到配色建议是深色系。
根据 meta.json 的 cdn_libs_used 字段，使用了 Tailwind CDN。
</think>
```

问题：出现了文件名和字段路径，不是自然思考过程。

### ❌ 没有发散→收敛过程

```
<think>
这个诗歌节页面需要有文学气质。选择深色主题，Playfair Display 字体，金色强调色。
直接开始写。
</think>
```

问题：直接给结论，没有视觉方向的比较过程，没有对其他可能方案的考虑和否定，没有犹豫和权衡。
