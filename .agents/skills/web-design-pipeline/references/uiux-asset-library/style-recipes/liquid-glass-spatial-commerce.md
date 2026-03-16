# Style Recipe: Liquid Glass Spatial Commerce

## Overview
A high-end mobile e-commerce aesthetic that combines "Liquid Metal" fluid backgrounds with "Frosted Glass" UI surfaces to create a sense of depth and luxury. It replaces traditional static lists with spatial, physics-based interactions (force-directed graphs, 3D models).

## Visual Primitives
- **Background**: `webgl-shader` (Noise field, liquid metal simulation, deep blue/black palette)
- **Surface**: `glass-panel` (Backdrop blur 20px+, white/10 opacity, thin white/20 border)
- **Typography**: `Inter` / `San Francisco` (Clean, white text with high contrast against dark backgrounds)
- **Motion**: `spring-physics` (Fluid, non-linear transitions), `morphing` (Shared element layout changes)
- **Accent**: `glow` (Soft radial gradients behind active elements)

## Implementation Hints
- **Tech Stack**: React + Three.js (R3F) + D3 + Framer Motion
- **Shader**: Simplex noise for fluid background (vertex displacement or fragment color mixing).
- **Glass Effect**: `backdrop-filter: blur(20px)` is heavy on mobile GPU; usage must be limited to key surfaces (cards, nav, overlays).
- **Navigation**: Avoid standard tab bars; use floating, morphing indicators.

## Suitable Domains
- **Luxury Goods**: Watches, Jewelry, High-end Tech
- **Conceptual**: AI Tools, Future Tech, Art Galleries
- **Spatial**: AR/VR Showcases

## Anti-Patterns
- **Solid Backgrounds**: Using flat colors kills the depth.
- **Heavy Borders**: Thick borders ruin the "airiness" of the glass.
- **Static Lists**: Standard grid/list views feel out of place; use masonry or spatial graphs.

## Metadata
- `style_keywords`: ["liquid", "glass", "spatial", "dark-mode", "luxury", "future-tech"]
- `interaction_level`: "high"
- `visual_primitives`: ["glow", "glass", "fluid", "3d", "orb"]
- `motion_primitives`: ["physics", "morph", "float"]
- `uiuxmax_domains`: ["style", "ux", "landing", "stack"]
- `suitable_stacks`: ["react-r3f", "nextjs-webgl"]
