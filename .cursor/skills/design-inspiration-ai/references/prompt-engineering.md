# 图像生成提示词构建指南

将概念发散结果转化为高质量图像生成提示词的完整框架。

---

## 提示词结构（六层叠加法）

```
[主体描述] + [形态特征] + [材质纹理] + [光线氛围] + [构图视角] + [风格关键词]
```

### 第一层：主体描述（Subject）
精确描述核心对象，包含功能/身份/状态。

```
✅ "a floating modular chair made of cloud-like forms"
✅ "an ancient ceremonial vessel reimagined in translucent resin"
❌ "a chair" (太笼统)
```

### 第二层：形态特征（Form）
描述形状语言、比例关系、结构特征。

| 形态词汇库 | |
|---------|---|
| 有机形态 | biomorphic, organic curves, flowing silhouette, amorphous |
| 几何形态 | geometric, angular, faceted, prismatic, modular |
| 混合形态 | hybrid form, morphing, transitional shape |
| 比例特征 | elongated, compressed, asymmetric, mirrored |
| 结构特征 | hollow, layered, interlocking, cantilevered, suspended |

### 第三层：材质纹理（Material & Texture）
描述表面质感、材料属性、肌理细节。

| 材质类别 | 关键词 |
|---------|------|
| 金属 | brushed steel, oxidized copper, liquid mercury, raw iron |
| 有机材质 | aged wood grain, cracked bark, weathered leather, bone |
| 玻璃/透明 | frosted glass, crystal clarity, translucent resin, iridescent |
| 织物 | woven texture, silk sheen, raw linen, velvet pile |
| 自然 | stone erosion, coral texture, moss covering, amber |
| 数字/合成 | holographic surface, glitch texture, pixel grain, neon glow |

### 第四层：光线氛围（Lighting & Atmosphere）
控制整体情绪和视觉调性。

| 光线类型 | 关键词 | 情绪 |
|---------|------|------|
| 自然光 | golden hour light, overcast diffuse, harsh noon shadow | 温暖/平静/戏剧 |
| 工作室光 | studio lighting, three-point light setup, product photography | 专业/清晰 |
| 环境光 | ambient glow, neon backlighting, candlelight, bioluminescent | 神秘/温柔 |
| 戏剧性 | chiaroscuro, rim light, dramatic spotlight, volumetric rays | 强烈/史诗 |
| 无影 | white void, pure white background, shadowless | 极简/产品感 |

### 第五层：构图视角（Composition & Camera）
控制空间关系和视觉引导。

| 视角 | 关键词 |
|-----|------|
| 正面/俯视 | front view, top-down perspective, bird's eye |
| 45°展示 | three-quarter view, product angle, showcase |
| 特写 | macro shot, extreme close-up, detail focus |
| 全景场景 | wide establishing shot, environmental context |
| 爆炸图 | exploded view diagram, technical illustration |

### 第六层：风格关键词（Style）
参考 `art-styles.md` 选择匹配的风格体系。

---

## 提示词模板库

### 产品设计概念
```
[物品名称] concept design, [形态特征], [主要材质], [表面质感], 
[光线设置], [背景/环境], [视角], rendered in [渲染风格], 
[艺术风格关键词], ultra-detailed, professional design photography
```

**示例：**
```
Modular storage system concept design, biomorphic interlocking forms, 
translucent frosted resin with embedded dried botanicals, soft diffuse 
studio lighting, pure white background, three-quarter view, rendered 
in Cinema 4D, organic minimalism, ultra-detailed, professional 
design photography
```

### 空间/建筑概念
```
[空间类型] interior/exterior, [设计风格], [主要材料], 
[空间特征], [光线来源], [氛围词], [视角], 
[艺术家/风格参考], architectural visualization
```

**示例：**
```
Meditation pavilion exterior, wabi-sabi Japanese aesthetic, 
weathered dark timber and rough stone, moss-covered roof, 
dappled morning light through bamboo, contemplative atmosphere, 
eye-level view, inspired by Tadao Ando, architectural visualization
```

### 品牌/视觉概念
```
[品牌元素] brand identity concept, [视觉风格], [色彩描述], 
[图形特征], [材质感], white background, flat lay or 3D render,
[风格关键词]
```

### 角色/生物概念
```
[角色描述], [设计风格], [材质/质感], [姿态/动作], 
[表情/情绪], [光线], full body or portrait, 
[艺术风格参考], character design sheet
```

---

## 多样性控制策略

同一概念产出4张不同图时，沿以下维度做差异化：

| 变量维度 | 变体A | 变体B | 变体C | 变体D |
|---------|------|------|------|------|
| 材质 | 金属冷硬 | 有机温暖 | 透明轻盈 | 粗糙原始 |
| 光线 | 强烈戏剧 | 柔和漫射 | 霓虹发光 | 自然户外 |
| 视角 | 产品展示45° | 特写细节 | 场景使用 | 爆炸结构 |
| 风格 | 极简 | 超现实 | 赛博朋克 | 自然有机 |

---

## 负面提示词（常用排除词）

```
low quality, blurry, distorted proportions, ugly, deformed, 
text overlay, watermark, cluttered background, amateur photography
```

---

## Gemini API 调用规范

本技能默认使用 `gemini-3-pro-image-preview`，每次调用产出 **4张差异化图像**（分4次调用，各用不同视觉角度的提示词）。

文件保存规范：
```python
# 文件名格式：concept_{概念简写}_{角度编号}.jpg
image.save(f"concept_{slug}_{n}.jpg")
```

宽高比推荐：
- 产品设计：`1:1` 或 `4:3`
- 空间建筑：`16:9` 或 `3:2`
- 角色设计：`3:4` 或 `2:3`
- 品牌视觉：`1:1` 或 `16:9`
