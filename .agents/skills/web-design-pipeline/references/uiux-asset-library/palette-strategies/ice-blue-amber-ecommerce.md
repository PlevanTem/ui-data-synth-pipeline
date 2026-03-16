# Ice Blue & Amber Ecommerce Palette

## 适用场景
*   科技类、3C 数码、高端生活方式电商
*   需要传达“冷静、专业”同时又有“活力、促销”暗示的场景

## 配色逻辑
*   **基调 (Base)**: Ice Blue (#F0F9FF - #E0F2FE)。比纯白更有质感，比灰色更清透，营造“冷”的高级感。
*   **主体 (Primary)**: Electric Blue (#2563EB)。经典的科技蓝，用于品牌识别和主要链接。
*   **强调 (Accent)**: Warm Amber (#F59E0B)。作为互补色，用于“购买”、“加入购物车”、“折扣”等 CTA，在冷色调背景中极度醒目。
*   **中性 (Neutral)**: Slate Gray (#0F172A - #64748B)。用于文字，避免纯黑的生硬。

## 色值表 (Tailwind CSS 映射)

| Role | Color | Hex | Tailwind |
|---|---|---|---|
| Background | Ice Blue 50 | #F0F9FF | `bg-sky-50` |
| Surface (Glass) | White / Alpha | #FFFFFF | `bg-white/70` |
| Primary | Blue 600 | #2563EB | `text-blue-600` / `bg-blue-600` |
| Secondary | Amber 500 | #F59E0B | `text-amber-500` / `bg-amber-500` |
| Text Main | Slate 900 | #0F172A | `text-slate-900` |
| Text Muted | Slate 500 | #64748B | `text-slate-500` |
| Border | Slate 200 | #E2E8F0 | `border-slate-200` |

## 渐变建议
*   **Hero Background**: `bg-gradient-to-b from-sky-100 to-white`
*   **Primary Button**: `bg-gradient-to-r from-blue-600 to-blue-500`
*   **Special Offer**: `bg-gradient-to-r from-amber-400 to-orange-500`

## 可访问性检查
*   Amber 500 在白色背景上的对比度可能不足，建议用于大按钮背景（配白字）或大标题。小字号请使用 Amber 600 (#D97706)。
*   Ice Blue 背景非常浅，Slate 500 以上的文字均可满足 AA 标准。
