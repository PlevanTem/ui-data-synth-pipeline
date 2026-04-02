# iOS 26 Liquid Glass — Web 端适配趋势笔记

## 来源

Apple WWDC 2026 设计发布 / Trifleck Blog / Apple Developer Documentation / OmniCart App 案例

## 趋势核心

Apple 在 iOS 26 中将磨砂玻璃升级为"Liquid Glass"：不再是静态半透明面板，而是强调**真实感、流动感和深度感**的动态材质，结合：
- `backdrop-filter: blur + saturate`
- 细腻 1px 半透明边框
- 轻量 tint（品牌色调）
- 微动效（hover/active 状态的流动感）

## Web 端适配关键结论

1. **使用位置**：
   - ✅ 适用：sticky nav、bottom sheet、modal overlay、floating toolbar
   - ❌ 不适用：密集内容卡片、信息列表、表格、正文区域

2. **CSS 公式**：
   ```css
   backdrop-filter: blur(16-20px) saturate(160-180%);
   background: rgba(255,255,255,0.80-0.92);
   border: 1px solid rgba(255,255,255,0.4);
   ```
   随滚动动态增强 blur（10px → 20px）更接近原生质感

3. **降级方案（必须写）**：
   ```css
   @supports not (backdrop-filter: blur(1px)) {
     .glass { background: rgba(255,255,255,0.97); }
   }
   ```

4. **prefers-reduced-motion**：所有玻璃层的 transition 和动画必须响应此媒体查询

5. **性能**：作用面积小时开销可接受；不要在整屏 / 商品列表上全面使用

## 与旧版"玻璃拟态"的区别

| | 旧版 Glassmorphism | iOS 26 Liquid Glass |
|---|---|---|
| 使用范围 | 铺满所有卡片 | 仅限浮层和导航 |
| 背景 | 强模糊 + 渐变色 | 克制模糊 + 中性底色 |
| 边框 | 明显白色 | 极细，若隐若现 |
| 动效 | 无 | spring 进入，微 hover |
| 感知 | "廉价科技感" | "高级材质感" |

## 适用产品类型

- Apple 生态产品（最适配）
- 高端消费品电商
- 健康/wellness 类移动应用
- 品质类 SaaS（不适合高密度数据工作台）
