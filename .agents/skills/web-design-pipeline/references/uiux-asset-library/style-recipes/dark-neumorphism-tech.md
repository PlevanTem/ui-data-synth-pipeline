# Dark Neumorphism (Tech & DevTools)

## 元数据
- `style_keywords`: dark mode, neumorphism, tech, dashboard, immersive, cyberpunk, glow
- `interaction_level`: immersive
- `visual_primitives`: glow, deep shadow, neon accents, dark baseline
- `motion_primitives`: scan-line, fade-in-up, pulse glow
- `implementation_hints`: CSS box-shadow, custom timing functions
- `uiuxmax_domains`: style, color, dashboard
- `suitable_stacks`: Any (Tailwind CSS highly recommended)
- `avoid_patterns`: High-contrast white shadows, saturated background gradients, overuse of glow

## 核心策略
在新拟态用于暗模式时，必须极端克制亮色的内阴影，采用类似 `#09090B` 极黑的底板，仅通过很暗的 `#121215` 面板凸起形成层级。高亮阴影限制在 `rgba(255,255,255,0.03)` 级别，以防止界面显脏。

## Tailwind 配置示例
```javascript
boxShadow: {
  'neumorph-up': '8px 8px 16px #000000, -8px -8px 16px rgba(255,255,255,0.03)',
  'neumorph-down': 'inset 6px 6px 12px #000000, inset -6px -6px 12px rgba(255,255,255,0.03)',
  'glow': '0 0 15px rgba(0, 240, 255, 0.4)'
}
```

## 交互模式
1. 按钮常态为 `neumorph-up`。
2. 点击态或输入框激活态为 `neumorph-down`。
3. 重点聚焦（如搜索框 active）时加上外发光的 `glow` 阴影。