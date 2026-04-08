# Soft Ops Canvas

## 适用场景
- 可观测性平台
- 性能分析工作台
- 高密度工程类 dashboard
- 需要自然语言查询 + 画布探索并存的开发者工具

## 核心方法
- 用暗色分层和精确边框建立主结构，不靠整页渐变制造科技感
- 只把新拟态用于按钮、切换器、输入框和微型浮块，提供触觉反馈
- 将主舞台交给可交互画布：点云、聚类、密度场、节点分布
- 将精确读数交给 SVG/表格，避免用 WebGL 替代所有信息表达

## 组合建议
- 画布式主视图 + 结构化查询解释面板
- SVG 趋势视图 + 高对比数据表 + 右侧详情抽屉
- 冷青色主强调 + 少量紫色热区 + 语义化成功/告警/错误色

## 关键边界
- 软阴影不可削弱文本和边框对比
- 生成式背景必须服务于筛选、聚类、下钻，不可变成屏保
- 自然语言入口应是“查询编译器”，不是闲聊机器人

## 不适用场景
- 强品牌叙事 landing page
- 情绪化消费产品
- 以内容阅读为主的轻应用

## 结构化标签
```yaml
style_keywords: ["soft-ops", "investigation-canvas", "dark-slate", "selective-neumorphism", "devtools"]
interaction_level: "high"
visual_primitives: ["depth", "field", "grid", "cluster", "mono-data"]
motion_primitives: ["drift", "brush-select", "soft-press", "state-fade", "drawer-reveal"]
implementation_hints: ["Three.js", "SVG", "vanilla-js", "Intersection Observer", "Web Speech API"]
uiuxmax_domains: ["style", "color", "ux", "chart", "stack"]
suitable_stacks: ["html-tailwind-js", "react", "nextjs"]
avoid_patterns: ["global-neumorphism", "hero-kpi-template", "purple-gradient-default", "chatbot-primary-ui"]
```
