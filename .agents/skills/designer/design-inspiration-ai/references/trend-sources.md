# 设计趋势情报源清单

> **核心原则：有品质、有辨识度、多样并存。**
> 每次扫描必须从「轮换池」中选取不同组合，严禁每次都扫同一批平台。
>
> | 轨道 | 适用场景 | 核心来源池（每次从中选4-6个，不重复组合） |
> |-----|---------|---------|
> | 🏛 **高端品牌轨** | 奢侈品、轻奢、品牌VI、精品包装 | WGSN · Nelly Rodi · Vogue · Cosmos.so · Wallpaper* · Dezeen · The Dieline · Pentawards |
> | 🎨 **商业插画轨** | IP设计、出版插画、品牌吉祥物、内容插图 | Bologna · Society of Illustrators · 3x3 · Pictoplasma · American Illustration · Graphis · Communication Arts · Lürzer's Archive · JAGDA |
> | ⚡ **新视觉实验轨** | 潮流品牌、数字艺术、潮玩、年轻化品牌 | It's Nice That · D&AD · Creative Review · Eye Magazine · AIGA Eye on Design · The Brand Identity · Cargo Collective · Are.na |
> | 🀄 **亚太/中文轨** | 东亚文化IP、国潮、亚洲商业插画、本土品牌 | 靳埭强设计奖 · 金点设计奖 · JAGDA · ADC Tokyo · Zcool站酷奖 · 古田路9号 · TOPYS · 数英SHUZHEN |
> | 🔤 **排版字体轨** | 平面版式、字体驱动设计、排印实验 | Typographica · Fonts In Use · Type Directors Club · Granshan · TypeWolf · Dinamo · Colophon |
> | 📦 **包装/产品轨** | 精品包装、消费品、零售视觉 | The Dieline · Pentawards · Red Dot · Packaging Digest · Mintel |
> | 🌐 **趋势预测轨** | 宏观视觉文化方向、消费者情绪 | Pinterest Predicts · WGSN · Shutterstock Creative Trends · Adobe Color Trends · Canvas8 · The Future Laboratory |
> | 📱 **UI/UX 数字产品轨** | 移动端App、Web、Landing Page、Design System | Awwwards · SiteInspire · Mobbin · Screenlane · Lapa Ninja · CSS Design Awards · UX Collective · Figma Community · Framer Community · Muzli |

---

## ⚠️ 轮换策略（防重复核心规则）

**每次执行 STEP 1.5 前，必须遵循以下规则：**

1. **记录上次已用的来源**（从会话上下文中读取），本次必须至少替换 50% 的搜索来源
2. **主轨道内部轮换**：每个轨道有 6-10 个来源，每次只选 2-3 个，下次换另外 2-3 个
3. **跨轨补充来源**：主轨之外至少从另一条轨道取 1-2 个来源，增加意外发现
4. **地理多样性**：在有条件时，组合覆盖 欧美 + 亚洲 + 本地 至少两个地区视角
5. **新旧信号混合**：至少 1 个搜索聚焦「刚刚冒头的新兴信号」（过去 6 个月内），至少 1 个聚焦「正在扩散的主流」（过去 12 个月）

**默认轮换顺序建议（按轨道，循环使用）：**

```
商业插画轨（本次）：
  A组：Bologna + Graphis + Lürzer's Archive
  B组：Society of Illustrators + American Illustration + 3x3
  C组：Pictoplasma + Communication Arts + JAGDA
  → 每次取不同组，循环

新视觉实验轨（本次）：
  A组：It's Nice That + D&AD
  B组：Creative Review + Eye Magazine
  C组：AIGA Eye on Design + The Brand Identity + Are.na
  → 同上循环

UI/UX 数字产品轨（本次）：
  A组：Awwwards + SiteInspire + Mobbin（网页+App视觉）
  B组：Screenlane + Lapa Ninja + CSS Design Awards（移动端+落地页）
  C组：Figma Community + Framer Community + UX Collective（设计系统+交互趋势）
  D组：Muzli + Smashing Magazine + Webflow Showcase（综合前沿）
  → 同上循环
```

---

## 目录

1. [品质过滤标准](#品质过滤标准)
2. [Tier 1 — 高端品牌轨](#tier-1--高端品牌轨)
3. [Tier 2 — 商业插画轨](#tier-2--商业插画轨)
4. [Tier 3 — 新视觉实验轨](#tier-3--新视觉实验轨)
5. [Tier 4 — 亚太/中文轨](#tier-4--亚太中文轨)
6. [Tier 5 — 排版字体轨](#tier-5--排版字体轨)
7. [Tier 6 — 包装/产品轨](#tier-6--包装产品轨)
8. [Tier 7 — 宏观趋势预测轨](#tier-7--宏观趋势预测轨)
9. [Tier 8 — UI/UX 数字产品轨](#tier-8--uiux-数字产品轨)
10. [搜索执行策略](#搜索执行策略)
11. [搜索词模板库](#搜索词模板库)

---

## 品质过滤标准

**通用排除标准（任意轨道均适用）：**
- AI 批量生产感（过于光滑、无叙事性、无作者痕迹、缺乏人工判断）
- 无来源可追溯的「风格汇总」内容
- 纯流量驱动的爆款（无设计深度，仅靠传播量出现）

**各轨道额外过滤：**
- 🏛 高端品牌轨：排除大众电商视觉（过度修图、强饱和、信息密度过高）
- 🎨 商业插画轨：排除无作者署名的聚合内容，优先有具名创作者的作品
- ⚡ 新视觉实验轨：排除抄袭/同质化严重的跟风内容，优先有风格辨识度的创作
- 🀄 亚太/中文轨：排除国内低价竞争导向的商业模板，优先奖项和机构认可作品
- 🔤 排版字体轨：排除字体测试图，优先有排版美学立场的实际应用案例
- 📱 UI/UX轨：排除 UI kit 截图和无交互语境的静态组件图，优先有完整产品视角或设计决策背景的案例

---

## Tier 1 — 高端品牌轨

> 🏛 适用：奢侈品、轻奢品牌、精品包装、高端品牌 VI。
> 输出特征：克制、材质精度、负空间、非装饰性细节。

### WGSN
- **定位：** 全球最权威的趋势预测机构，覆盖色彩/材质/视觉/时尚/生活方式
- **搜索策略：**
  ```
  WGSN 2025 2026 color material trend luxury
  WGSN "key color" OR "material direction" 2026
  WGSN trend report "[设计类别]" 2025
  ```

### Vogue（含 Vogue Business）
- **定位：** 时尚圣经，高奢品牌广告/大片/发布会视觉美学第一手呈现
- **搜索策略：**
  ```
  Vogue 2025 visual aesthetic trend editorial
  Vogue Business design trend 2025 luxury brand visual
  ```

### Nelly Rodi
- **定位：** 法国顶级趋势机构，专注时尚/生活方式/奢侈品趋势
- **搜索策略：**
  ```
  Nelly Rodi 2025 2026 trend color aesthetic
  "Nelly Rodi" color palette trend 2026
  ```

### Wallpaper* Magazine
- **定位：** 跨建筑/工业/时尚/图形的顶刊，对新兴设计运动反应敏锐
- **搜索策略：**
  ```
  site:wallpaper.com design "[类别]" 2025 2026
  wallpaper design award 2026 winner illustration brand
  Wallpaper* "best of" 2026 graphic design identity
  ```

### Dezeen
- **定位：** 建筑与产品设计权威媒体，Design of the Year 覆盖跨界创新
- **搜索策略：**
  ```
  site:dezeen.com design 2026 "[风格/材质]"
  dezeen "design of the year" 2026 brand identity
  dezeen award 2025 2026 graphic design winner
  ```

### Cosmos.so
- **定位：** 设计师严选视觉灵感聚合平台，内容由设计师手动策展，质量极高
- **搜索策略：**
  ```
  site:cosmos.so "[设计类别]" brand
  cosmos.so "[风格关键词]" editorial luxury
  ```
- **直接访问：** [cosmos.so](https://cosmos.so)

### The Dieline（高端包装）
- **定位：** 全球最具影响力的包装设计媒体，Awards每年评选包装美学风向
- **搜索策略：**
  ```
  thedieline.com 2026 award winner packaging design trend
  The Dieline "best packaging" 2025 2026 illustration
  site:thedieline.com illustration OR brand identity 2026
  ```

---

## Tier 2 — 商业插画轨

> 🎨 适用：出版插画、品牌 IP、吉祥物、内容插图、角色设计、书籍装帧。
> 输出特征：有叙事性、有作者签名风格、技法可辨识、商业可落地。

### Bologna Children's Book Fair（博洛尼亚国际童书展）
- **定位：** 全球插画最高水准年度展览
- **搜索：**
  ```
  Bologna illustrators exhibition 2026 winner selected style
  Bologna Children's Book Fair 2026 illustration trend aesthetic
  ```

### Society of Illustrators（美国插画协会）
- **定位：** 北美插画年度风向标，商业插画最权威评选
- **搜索：**
  ```
  Society of Illustrators annual 68 2026 award winner style
  societyillustrators.org 2026 editorial illustration trend
  ```

### American Illustration（AI Annual）
- **定位：** 北美另一大插画年鉴，更偏编辑类和出版类插画，风格多元
- **搜索：**
  ```
  American Illustration annual 2025 2026 winner style trend
  "American Illustration" AI annual selected editorial book
  ```

### Graphis
- **定位：** 跨越平面/插画/摄影/广告的高端年鉴，历史权威性强
- **搜索：**
  ```
  Graphis illustration annual 2025 2026 platinum gold award winner
  site:graphis.com illustration 2026 trend style
  Graphis design annual 2026 best illustration editorial
  ```

### Communication Arts（CA）
- **定位：** 北美图形/插画年鉴，收录标准极严，每期获奖均有明确风格描述
- **搜索：**
  ```
  Communication Arts illustration annual 2025 2026 winner
  CA Awards 2026 illustration style trend emerging
  ```

### Lürzer's Archive
- **定位：** 德国出版的广告创意档案，聚焦插画在广告中的应用，是品牌插画风格的晴雨表
- **搜索：**
  ```
  Lurzer's Archive illustration advertising 2025 2026 style trend
  "Lurzer's Archive" best illustrated ad campaign 2026
  ```

### 3x3 Magazine（国际插画年鉴）
- **定位：** 专注原创当代插画，覆盖商业/出版/自主创作三类
- **搜索：**
  ```
  3x3 magazine illustration annual 2025 2026 winner
  3x3 show 2026 illustration style emerging
  ```

### Pictoplasma（柏林角色艺术节）
- **定位：** 全球角色设计/当代插画最重要聚集地，每年4月柏林举办
- **搜索：**
  ```
  Pictoplasma 2025 2026 character design award winner
  Pictoplasma festival 2026 visual style emerging
  ```

### JAGDA（日本图形设计师协会）
- **定位：** 日本最权威的平面设计机构，年鉴收录代表日式美学最高水准
- **搜索：**
  ```
  JAGDA 2025 2026 illustration graphic design award Japan
  JAGDA annual book 2026 winner selected style
  Japan graphic design trend 2026 illustration award
  ```

### Behance（插画/品牌类精选）
- **定位：** 全球最大设计师作品集平台
- **搜索：**
  ```
  site:behance.net illustration "[风格关键词]" 2025 2026
  behance "editorial illustration" OR "brand illustration" 2026
  ```

---

## Tier 3 — 新视觉实验轨

> ⚡ 适用：潮流品牌、数字艺术、潮玩、年轻化品牌、实验性视觉、跨媒介设计。
> 输出特征：有辨识度、有态度、技术或风格创新、风格边界清晰。

### It's Nice That
- **定位：** 英国精选设计媒体，报道有艺术价值和文化立场的视觉创作
- **搜索：**
  ```
  site:itsnicethat.com "[风格/主题]" 2025 2026
  itsnicethat "graphic trend" OR "illustration" 2026 forward thinking
  ```

### D&AD（广告/品牌类）
- **定位：** Yellow/Black Pencil 是全球广告/品牌设计最高荣誉
- **搜索：**
  ```
  D&AD 2026 pencil award winner "[类别]"
  D&AD annual 2026 illustration brand design trend
  ```

### Creative Review
- **定位：** 英国老牌创意媒体，报道面广（广告/品牌/插画/摄影），有深度批评视角
- **搜索：**
  ```
  Creative Review 2026 illustration trend emerging style
  site:creativereview.co.uk 2026 illustration brand visual
  Creative Review "best of" 2025 2026 graphic design illustration
  ```

### Eye Magazine
- **定位：** 英国出版的平面设计学术媒体，深度评论视角，代表学院派和批评性思维
- **搜索：**
  ```
  Eye Magazine graphic design 2025 2026 illustration trend critical
  eyemagazine.com 2026 review identity visual culture
  ```

### AIGA Eye on Design
- **定位：** 美国图形设计协会出版，关注设计文化前沿与新兴创作者
- **搜索：**
  ```
  AIGA Eye on Design 2026 "[类别]" emerging trend illustration
  eyeondesign.aiga.org 2026 graphic design illustration
  ```

### The Brand Identity
- **定位：** 专注品牌识别的高质量精选平台，案例有明确设计立场
- **搜索：**
  ```
  the-brandidentity.com 2026 illustration brand identity visual
  site:the-brandidentity.com illustration 2025 2026
  The Brand Identity "best branding" 2026 illustration character
  ```

### Are.na（Arena）
- **定位：** 设计师/艺术家手动策展的灵感聚合平台，无算法推荐，代表当代创意人的真实审美关注
- **搜索：**
  ```
  are.na illustration trend 2025 2026 visual style channel
  "are.na" graphic design collection "[风格]" 2026
  arena channel illustration aesthetic 2026
  ```

### Cargo Collective
- **定位：** 独立创意人作品集平台，有大量前沿插画师和平面设计师原创作品
- **搜索：**
  ```
  cargo.site illustration 2025 2026 graphic design visual style
  cargocollective illustration trend editorial new emerging
  ```

### Motionographer（运动/动画）
- **定位：** 动态设计和动画领域最权威精选媒体，对视觉风格有极高品味
- **搜索：**
  ```
  motionographer 2026 motion design style trend illustration animation
  site:motionographer.com 2026 visual trend emerging
  ```

---

## Tier 4 — 亚太/中文轨

> 🀄 适用：东亚文化IP、国潮品牌、亚洲商业插画、本土视觉叙事。
> 输出特征：东方符号系统、本土叙事、文化自信视觉、亚洲色彩体系。

### 靳埭强设计奖
- **定位：** 聚焦中文文化与当代视觉设计的重量级奖项
- **搜索：**
  ```
  靳埭强设计奖 2025 2026 获奖 插画 视觉 风格
  ```

### 金点设计奖（Golden Pin Design Award）
- **定位：** 台湾主办，面向大中华区及东亚的设计权威奖项，覆盖平面/品牌/包装/产品
- **搜索：**
  ```
  金点设计奖 2025 2026 获奖 平面 插画 品牌
  Golden Pin Design Award 2026 winner graphic illustration
  ```

### ADC Tokyo / TDC Tokyo
- **定位：** 日本广告设计年鉴/东京字体指导俱乐部，代表东亚最高商业视觉水准
- **搜索：**
  ```
  ADC Tokyo annual 2025 2026 illustration graphic design winner
  TDC Tokyo 2026 typography illustration award Japan
  ```

### TOPYS（顶尖文案）
- **定位：** 中国设计与广告创意媒体，有深度策展和趋势分析，代表中国设计批评视角
- **搜索：**
  ```
  TOPYS 2026 设计趋势 插画 视觉 品牌 风格
  site:topys.cn 2025 2026 插画 平面设计 趋势
  ```

### 数英 SHUZHEN
- **定位：** 中国营销与创意媒体，覆盖品牌案例和视觉趋势，有大量国内外商业案例
- **搜索：**
  ```
  数英 2026 插画 设计趋势 品牌视觉 商业插画
  site:digitaling.com 2025 2026 插画 视觉风格 趋势
  ```

### 站酷奖（Zcool Awards）
- **定位：** 国内设计行业风向，站酷奖获奖作品代表中国商业设计当年度最高水准
- **搜索：**
  ```
  站酷奖 2025 2026 获奖 品牌 插画 平面设计
  zcool 2025 2026 illustration trend winning design
  ```

### 古田路9号（gtn9.com）
- **定位：** 国内品牌包装设计专业社区，内容垂直、精选
- **搜索：**
  ```
  site:gtn9.com 品牌 插画 包装 2025 2026 风格趋势
  古田路9号 2026 插画风格 品牌 平面
  ```

### Behance（亚洲设计师精选）
- **定位：** 搜索时限定东亚地区或语言，挖掘亚洲视角
- **搜索：**
  ```
  behance illustration "China" OR "Japan" OR "Korea" 2025 2026 commercial
  behance "East Asia" brand illustration character 2026
  ```

---

## Tier 5 — 排版字体轨

> 🔤 适用：排印实验、字体驱动设计、版式美学趋势。

### Typographica
- **搜索：** `typographica.org 2025 2026 best typefaces favorite`

### Fonts In Use
- **搜索：** `fontsinuse.com "[风格]" 2025 2026 illustration editorial`

### Type Directors Club（TDC）
- **搜索：** `TDC annual 2026 typography award winner trend`

### Dinamo / Colophon / Swiss Typefaces
- **搜索：** `Dinamo fonts 2026 new release design visual` / `Colophon foundry 2026`

### TypeWolf
- **搜索：** `typewolf.com 2025 2026 trending typeface sites`

---

## Tier 6 — 包装/产品轨

> 📦 适用：精品包装、消费品视觉系统、零售美学。

### The Dieline
- **搜索：** `thedieline.com award 2026 best packaging illustration trend`

### Pentawards
- **搜索：** `Pentawards 2026 diamond platinum winner packaging design style`

### Red Dot / iF Award
- **搜索：** `Red Dot 2026 best of best communication design` / `iF Design Award 2026 graphic`

---

## Tier 7 — 宏观趋势预测轨

> 🌐 适用：不确定方向时的宏观扫描，或需要消费者情绪/文化背景时。

### Pinterest Predicts
- **搜索：**
  ```
  Pinterest Predicts 2026 design aesthetic visual trend
  Pinterest trend 2026 illustration mood board aesthetic
  ```

### Shutterstock Creative Trends
- **搜索：**
  ```
  Shutterstock creative trends 2026 illustration design visual
  Shutterstock "color trends" OR "design trends" 2026
  ```

### Adobe Color / Adobe Creative Trends
- **搜索：**
  ```
  Adobe color trends 2026 palette design
  Adobe Creative Trends 2026 illustration visual report
  ```

### Stills / Getty / iStock Visual Insights
- **搜索：**
  ```
  Getty Images visual trends 2026 illustration design
  iStock 2026 creative trends report illustration
  Stills 2026 trends report design human-centered
  ```

### Canvas8 / The Future Laboratory
- **搜索：**
  ```
  Canvas8 2026 trend report visual design cultural
  "Future Laboratory" 2026 design trend forecast aesthetic
  ```

---

## Tier 8 — UI/UX 数字产品轨

> 📱 适用：移动端 App、Web 设计、H5/Landing Page、Design System、交互视觉趋势。
> 输出特征：有完整产品语境（非孤立截图）、有交互/流程意识、风格可落地于真实界面。

### Awwwards
- **定位：** Web 设计最高荣誉平台，SOTD/SOTM 代表当年度最前沿的网页视觉风格
- **覆盖：** 落地页、品牌官网、创意互动网页
- **搜索：**
  ```
  Awwwards site of the year 2025 2026 web design visual trend
  Awwwards "best of" 2026 landing page UI style
  site:awwwards.com 2026 web design trend color motion
  ```

### SiteInspire
- **定位：** 高品质网页设计精选画廊，由设计师手动策展，无流量噪音
- **覆盖：** 企业官网、作品集、创意工作室、品牌网站
- **搜索：**
  ```
  siteinspire.com 2025 2026 web design style trend minimal
  SiteInspire best web design 2026 visual direction
  ```

### Mobbin
- **定位：** 全球最大移动端 App UI 截图库，按流程/组件/风格分类，Apple + Android 均覆盖
- **覆盖：** App 界面模式、onboarding、空状态、导航结构
- **搜索：**
  ```
  Mobbin app design trend 2025 2026 mobile UI style
  mobbin.com "[App 类别]" UI design pattern 2026
  mobile app design trend 2026 Mobbin analysis
  ```

### Screenlane
- **定位：** 移动端 App 界面精选，专注单屏截图和交互细节，质量高于 Dribbble
- **覆盖：** 情绪化空状态、onboarding 流程、工具类 App 界面
- **搜索：**
  ```
  Screenlane app UI design 2025 2026 trend mobile interface
  screenlane.com "[界面类型]" design trend style
  ```

### Lapa Ninja
- **定位：** Landing Page 精选库，专注转化向的落地页视觉风格
- **覆盖：** SaaS、金融科技、消费品、AI 产品落地页
- **搜索：**
  ```
  Lapa Ninja landing page design trend 2025 2026 visual style
  lapaninja best landing page 2026 UI design aesthetic
  ```

### CSS Design Awards
- **定位：** 网页 CSS 创意奖项，聚焦视觉创新和交互实验
- **搜索：**
  ```
  CSS Design Awards 2025 2026 winner web visual trend
  cssdesignawards.com WOTD 2026 design style interactive
  ```

### Figma Community
- **定位：** Figma 官方社区，热门文件和 Featured 资源代表设计师的真实审美共识
- **覆盖：** UI kit 趋势、Design System 风格、组件美学方向
- **搜索：**
  ```
  Figma Community featured design system 2025 2026 UI trend
  figma community "popular" UI kit design trend 2026
  Figma Config 2025 2026 design system visual direction
  ```

### Framer Community / Framer Templates
- **定位：** No-code 网页工具社区，模板风格高度反映当下流行的 Web 视觉语言
- **覆盖：** 作品集网站、SaaS 官网、品牌展示页
- **搜索：**
  ```
  Framer template design trend 2025 2026 web visual style
  framer.com community template "[设计类别]" aesthetic 2026
  ```

### Muzli（InVision）
- **定位：** InVision 出品的设计灵感聚合工具，每日精选覆盖 UI、插画、品牌、动效
- **搜索：**
  ```
  Muzli design inspiration 2026 UI web mobile trend visual
  Muzli "top design" 2025 2026 product UI trend
  ```

### UX Collective（Medium）
- **定位：** UX 设计师最大写作社区，包含大量「年度趋势」「产品设计反思」等深度文章
- **搜索：**
  ```
  UX Collective 2026 design trend product UI visual emerging
  "UX Collective" "2026" mobile app web design trend
  UX Collective annual review 2025 design direction
  ```

### Smashing Magazine（网页/前端设计）
- **定位：** 前端与 Web 设计最权威媒体之一，兼顾视觉美学与技术实现
- **搜索：**
  ```
  Smashing Magazine web design trends 2026 UI visual
  site:smashingmagazine.com 2026 design trend UI UX
  ```

### Webflow Showcase
- **定位：** Webflow 官方作品展示，精选网站代表当下无代码 Web 设计的美学前沿
- **搜索：**
  ```
  Webflow showcase 2025 2026 best website design visual trend
  webflow.com/made-in-webflow 2026 design style award
  ```

### Refero / Pageflows（交互流程参考）
- **定位：** 专注真实产品的完整用户流程截图，适合研究 UX 模式和交互视觉规范
- **搜索：**
  ```
  Pageflows app UX flow design trend 2025 2026
  Refero app design pattern 2026 "[App 类型]"
  ```

---

## 搜索执行策略

### 第一步：根据设计需求判断主轨道

| 设计需求信号 | 主轨道 | 必搜来源（从池中选，每次不同） |
|-----------|-------|---------|
| 品牌VI、包装、奢侈品、精品 | 🏛 高端品牌轨 | WGSN / Nelly Rodi / Wallpaper* / Dezeen / The Dieline（轮换） |
| IP、插画、角色、书籍、内容图 | 🎨 商业插画轨 | Bologna / Graphis / American Illustration / CA / Lürzer's（轮换） |
| 潮流品牌、数字艺术、年轻化、实验性 | ⚡ 新视觉实验轨 | Creative Review / Eye Magazine / D&AD / AIGA / The Brand Identity（轮换） |
| 国内品牌、东亚文化、国潮 | 🀄 亚太/中文轨 | 靳埭强 / 金点奖 / ADC Tokyo / TOPYS / 数英（轮换） |
| 排版/版式驱动 | 🔤 排版字体轨 | Typographica / TDC / Fonts In Use / TypeWolf（轮换） |
| 移动端App、Web、H5、落地页、Design System | 📱 UI/UX 数字产品轨 | Awwwards / Mobbin / SiteInspire / Screenlane / Figma Community（轮换） |
| 宏观方向不明确 | 🌐 宏观预测轨 | Pinterest Predicts + Adobe Trends + Shutterstock + Canvas8（轮换） |

### 第二步：执行 4-6 次 WebSearch（遵循轮换策略）

- **必须**：每次记录使用了哪些来源，下次切换
- 主轨道来源执行 3-4 次
- 跨轨补充（如插画项目也需参考字体/排版趋势）执行 1-2 次
- 每次搜索使用「搜索词模板库」中的关键词组

### 第三步：品质过滤

- 执行「品质过滤标准」中的通用排除标准
- 按主轨道执行额外过滤
- 每条洞察注明来源平台和所属轨道

**搜索时效：** 年份限定当前年或前一年。

---

## 搜索词模板库

按设计类别 × 轨道选取关键词组合：

**A. 通用类别 × 风格轨道**

| 设计类别 | 🏛 高端品牌轨 | 🎨 商业插画轨 | ⚡ 新视觉实验轨 | 🀄 亚太/中文轨 |
|---------|------------|------------|--------------|-------------|
| 品牌/Logo | `brand identity luxury editorial refined` | `brand illustration mascot identity` | `brand identity experimental bold` | `品牌 东方 插画 国潮 2026` |
| 包装 | `premium packaging minimal artisan` | `illustrated packaging character label` | `packaging design bold graphic playful` | `包装设计 插画 文化 2026` |
| 插画 | `editorial illustration fine art gallery` | `commercial illustration annual award` | `illustration new style emerging 2026` | `插画 获奖 东亚 2026` |
| 海报/平面 | `poster design typographic award` | `illustrated poster annual award` | `poster design bold graphic trend 2026` | `海报 平面 设计奖 2026` |
| 角色/IP | `art toy collectible designer toy` | `character design IP mascot award` | `character design new style 2026` | `IP 角色 吉祥物 东亚 2026` |
| 字体/排版 | `bespoke typography award lettering` | `hand lettering illustration` | `typographic experiment new design 2026` | `字体 排版 东亚 2026` |

**B. UI/UX 数字产品轨专属搜索词**

| 场景 | 📱 UI/UX 数字产品轨关键词 | 优先来源 |
|-----|----------------------|---------|
| 移动端 App 视觉 | `mobile app UI design trend 2026 visual style` | Mobbin · Screenlane |
| Web / 官网 | `web design trend 2026 visual aesthetic site` | Awwwards · SiteInspire · Webflow |
| Landing Page / H5 | `landing page design trend 2026 SaaS visual` | Lapa Ninja · CSS Design Awards |
| Design System 风格 | `design system 2026 visual style UI kit trend` | Figma Community · Framer |
| 交互/动效趋势 | `UI motion design trend 2026 interaction animation` | Framer · Motionographer · Muzli |
| 产品 UX 方向 | `product design trend 2026 UX mobile app` | UX Collective · Smashing Magazine |
| 国内App视觉 | `国内 App 界面设计 2026 趋势 视觉风格` | 数英 · 站酷 · 古田路9号 |
| 企业/B端系统 | `enterprise UI design system 2026 dashboard visual` | Figma Community · Dribbble · Behance |

**使用方式：** 根据主轨道取对应行的关键词，追加年份（结合当前时间），填入对应来源的搜索框架。UI/UX 轨优先使用 B 表，其他轨使用 A 表。
