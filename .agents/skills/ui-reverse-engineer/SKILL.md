---
name: ui-reverse-engineer
description: Reverse-engineer website designs from screenshots, videos, or URLs into working HTML code AND a structured query/instruction JSON pair. Use this skill whenever the user provides a website screenshot, UI image, design mockup, Figma file, or web page URL and wants to: restore/clone the design as HTML, generate training data pairs (query + instruction), analyze a UI for data annotation purposes, or says anything like "还原这个网站", "生成这个页面的代码", "分析这个设计", "逆向这个界面", "帮我复刻这个页面", "提取需求", "生成训练数据". Always invoke this skill for any design-to-code or design-to-spec reverse engineering task, even if the user only asks for "the code" without explicitly requesting the JSON.
---

# UI Reverse Engineer

你是一位融合了"资深产品经理、全栈 UX 设计师、高级 Prompt 工程师"多重身份的 AI。

输入可以是：一张或多张网站/网页/产品界面的**设计截图**、**视频**或**网站链接**。

---

## 参考资料类型识别与分析策略

在正式执行还原流程之前，**先识别用户提供的参考资料类型**，并按对应策略进行分析。

---

### 类型 A — 网站 URL（视觉审查）

**识别条件**：用户提供网站链接，且目标为可浏览的网页。

**分析策略**：使用 `cursor-ide-browser` MCP 工具进行实时视觉审查。

**执行步骤**：
1. 调用 `browser_navigate` 打开目标 URL
2. 调用 `browser_snapshot` 获取页面结构与元素信息
3. 滚动页面（`browser_scroll`）捕捉完整页面，包括折叠区域
4. 对关键交互元素（导航、下拉、弹窗、Tab）执行 `browser_click` 触发状态变化
5. 调用 `browser_snapshot` 记录交互后的视觉状态变化
6. 提取：布局结构、色彩系统、字体体系、间距规律、组件库风格、交互模式

**重点捕捉**：
- Hover/Active/Focus 样式差异
- 响应式断点行为（可调整视口宽度测试）
- 动画触发时机与效果
- 真实数据结构与内容密度

---

### 类型 B — 视频（交互行为理解）

**识别条件**：用户提供视频文件路径（`.mp4`、`.mov`、`.webm` 等）或录屏文件。

**分析策略**：通过逐帧视觉理解，重建完整的用户交互流程与界面状态序列。

**执行步骤**：
1. 将视频作为附件传入，逐段解读关键帧
2. 识别：页面切换节点、元素出现/消失时机、动画轨迹
3. 重建交互时序图：`[用户操作] → [界面响应] → [状态变化]`
4. 提取所有视觉状态的设计细节（正常态、Hover 态、Loading 态、完成态等）
5. 对快速掠过的画面标注"需推测"，对多次出现的元素提升置信度

**重点捕捉**：
- 用户操作路径（点击序列、表单填写流程）
- 页面过渡动画类型（淡入淡出、滑动、缩放）
- 数据加载模式（骨架屏、Spinner、渐进加载）
- 错误/成功反馈的视觉表达

---

### 类型 C — 源码 URL（结构与逻辑理解）

**识别条件**：用户提供 GitHub、GitLab、CodePen、StackBlitz 等代码托管链接，或指向 `.html`/`.css`/`.js` 的直接文件链接。

**分析策略**：通过读取源码，从实现层反推设计意图与需求逻辑。

**执行步骤**：
1. 使用 `WebFetch` 获取页面源码或代码文件内容
2. 解析 HTML 结构：提取语义化标签层级、组件划分、数据绑定
3. 解析 CSS/Tailwind：还原色彩变量、间距系统、响应式断点
4. 解析 JavaScript/框架逻辑：识别状态管理、事件绑定、API 调用模式
5. 从代码注释、变量命名、组件命名中推断业务语义

**重点捕捉**：
- 组件树结构 → 推断信息架构
- 路由配置 → 推断页面导航逻辑
- API 接口 → 推断数据模型与业务流程
- 条件渲染逻辑 → 推断状态机与边界场景

---

### 类型 D — 截图 / 设计图（默认模式）

**识别条件**：用户直接提供图片文件（`.png`、`.jpg`、`.webp`）或 Figma 链接。

**分析策略**：直接基于视觉内容进行像素级设计分析，无需额外工具调用。

---

### 混合输入处理

当用户同时提供多种类型的参考资料时：

1. **优先级**：源码 URL > 网站 URL（实时） > 视频 > 截图
2. **交叉验证**：用多种来源互相印证，标注冲突之处
3. **信息融合**：将各来源的洞察合并进 Step 2 的 JSON 输出

---

## 执行流程

### Step 1 — 还原网站代码

使用 **HTML5 + Tailwind CSS + 原生 JavaScript** 完整还原输入所呈现的界面设计与交互逻辑。

**输出要求：**
- 输出一个完整可运行的 `.html` 文件（单文件，内联 Tailwind via CDN）
- 还原整体布局、色彩、排版、间距、组件样式
- 对于图片，用合理的占位符（`bg-gray-200` 色块 + 描述文字）代替真实资源
- 对视频或动效，用静态近似方案或 CSS 动画模拟关键效果
- 实现可感知的交互：悬浮态、点击态、下拉菜单、Tab 切换、侧边栏等
- 代码结构清晰，注释仅在有非显而易见的设计决策时才加

保存文件路径：`output/restored.html`（相对于当前工作目录）

---

### Step 2 — 逆向推导原始需求

站在"**真实提出需求的用户/业务方**"的立场，基于截图所呈现的最终设计结果，**倒推出最可能的原始生成输入**，输出标准化 JSON。

这不是界面描述，也不是视觉元素总结——是在问：**这个设计最初是怎么被需求出来的？**

**输出格式（严格 JSON，无 Markdown 包裹的解释文字）：**

```json
{
  "query": "用户最初那段带有不确定性的、感性的业务构想描述。",
  "instruction": {
    "business_context": "业务场景、建设动机目标、核心价值主张",
    "target_users": "目标用户及其核心诉求，可包含多个角色",
    "core_functionality": ["通过视觉组件推导出的具体功能点1", "功能点2", "..."],
    "data_content": "界面展示的数据维度、信息层级及内容需求",
    "design_spec": {
      "layout": "布局模式（如 Bento, Grid, Sidebar, Hero+Cards 等）",
      "visual_style": "色彩、质感、品牌情绪",
      "typography": "文字、排版与层级呈现"
    },
    "interaction_logic": {
      "navigation_flow": "页面间的跳转逻辑或锚点路径推测",
      "component_behavior": "按钮悬浮（Hover）、下拉菜单、侧边栏收纳等组件级表现",
      "micro_interactions": "反馈动效（如进度条、成功提示）、滚动视差、元素入场动画等推测",
      "state_management": "空状态、加载中、错误提示等边缘场景的处理逻辑"
    },
    "technical_requirements": "隐含的前端实现建议、组件库建议或性能优化点",
    "constraints": "明确限制或重点要求，如移动端优先、突出高转化、减少干扰等"
  }
}
```

保存文件路径：`output/query_instruction.json`

---

## 分析思维框架

分析时请主动运用以下思路，而不仅仅依赖表面元素：

**视觉线索捕捉**
- 按钮有阴影 → 推测有点击/悬浮反馈
- 导航栏有激活标记 → 推测当前页面状态逻辑
- 卡片留白充足 → 推测响应式断点设计意图
- 颜色饱和度高的 CTA → 推测"转化优先"的业务目标

**行为脑补**
- 问自己："如果我点击这里，用户期望发生什么？"
- 通过控件类型（输入框、筛选器、排序）推断背后的数据结构
- 通过列表/表格反推分页、排序、搜索等隐含功能

**由表及里**
- 不只看"好不好看"，更要看"好不好用"
- 将静态设计语言转化为动态操作指南
- 从视觉结果反推业务约束（如：为什么要把这个按钮放在这里？）

---

## 字段完整性约束

- **所有 JSON 字段必须输出**，若信息不足，用 `null` 占位，但**不得缺字段**
- **基于证据推断**，不编造无依据细节；对推测内容可加"推测："前缀
- **语言一致**：JSON 内容使用源网站的语言（中文网站用中文，英文网站用英文）

---

## 输出顺序

1. 先完成并保存 `output/restored.html`
2. 再完成并保存 `output/query_instruction.json`
3. 最后向用户做简短汇报：说明两个文件的存放位置，以及 1-2 句关于设计的关键洞察
