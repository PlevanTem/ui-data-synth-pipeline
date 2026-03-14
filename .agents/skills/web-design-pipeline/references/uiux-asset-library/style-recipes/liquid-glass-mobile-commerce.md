---
asset_id: style-liquid-glass-mobile-commerce
asset_type: style-recipe
title: Liquid Glass Mobile Commerce
summary: 面向高端移动电商的 Liquid Glass 材质与动态模糊交互配方。
domains:
  - ecommerce
  - mobile-commerce
  - beauty
  - premium-tech
style_keywords:
  - liquid-glass
  - mobile
  - premium
  - future-clean
interaction_level: high
visual_primitives:
  - glass-surface
  - z-layering
  - optical-refraction
motion_primitives:
  - press-feedback
  - dynamic-blur
implementation_hints:
  - backdrop-filter
  - dark-mode-adaptation
  - mobile-gpu-budget
uiuxmax_domains:
  - style
  - ux
  - web
  - stack
suitable_stacks:
  - react
  - nextjs
  - shadcn
avoid_patterns:
  - strong-blur-under-long-text
  - full-screen-backdrop-filter-on-low-end-android
  - fully-transparent-glass
component_primitives:
  - mobile-nav
  - product-sheet
  - floating-toolbar
motion_stack:
  - motion
data_stack: []
rendering_stack:
  - css
---

# Liquid Glass Mobile Commerce Style Recipe

## 适用场景
*   高端移动端电商 (Fashion, Beauty, Tech)
*   需要展现“未来感”或“纯净感”的品牌
*   图片质量极高，需要界面“隐形”的场景

## 核心特征
1.  **物理光学模拟**: 不再是简单的半透明，而是模拟光线穿过不同厚度玻璃的折射与色散。
2.  **动态模糊**: 模糊半径 (`blur`) 随背景内容的距离或滚动速度动态变化。
3.  **极简边框**: 0.5px - 1px 的高亮边框，模拟玻璃边缘的反光。
4.  **空间分层**: 明确的 Z 轴层级，内容在底层，操控层在顶层。

## CSS 实现参考
```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  border-radius: 24px;
}

/* Dark Mode Adaptation */
@media (prefers-color-scheme: dark) {
  .liquid-glass {
    background: rgba(15, 23, 42, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  }
}
```

## 交互建议
*   **按压效果**: 点击时，玻璃层应轻微缩小 (scale 0.98) 并增加不透明度，模拟受力。
*   **滑动效果**: 列表滑动时，顶部导航栏的模糊度可随速度增加，模拟动态模糊。

## 避坑指南
*   ❌ 不要在大段文字下使用强模糊，会严重影响阅读体验。
*   ❌ 避免在 Android 低端机上大面积使用 `backdrop-filter`，会导致掉帧。
*   ❌ 玻璃背景色不要完全透明，至少保持 50% 以上的不透明度或叠加噪点，否则会显得脏。
