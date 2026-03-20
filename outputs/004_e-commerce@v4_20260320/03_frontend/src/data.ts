import type { GraphNode, ProductItem } from "./types";

export const PRODUCTS: ProductItem[] = [
  { id: "p1", title: "AeroBuds Pro", brand: "NordTune", country: "JP", price: 129, trust: 88, tags: ["audio", "noise-cancel"], inStock: true },
  { id: "p2", title: "Luma Skin Serum", brand: "VeraBio", country: "KR", price: 56, trust: 82, tags: ["beauty", "sensitive"], inStock: true },
  { id: "p3", title: "Volt Travel Charger", brand: "AxisTech", country: "SG", price: 39, trust: 90, tags: ["travel", "usb-c"], inStock: true },
  { id: "p4", title: "MicroCloud Camera", brand: "NordTune", country: "US", price: 349, trust: 77, tags: ["camera", "ai"], inStock: false },
  { id: "p5", title: "Eco Brew Pods", brand: "GreenPort", country: "DE", price: 19, trust: 86, tags: ["kitchen", "eco"], inStock: true },
  { id: "p6", title: "Navi Fold Stand", brand: "AxisTech", country: "JP", price: 29, trust: 80, tags: ["mobile", "accessory"], inStock: true }
];

export const GRAPH_NODES: GraphNode[] = [
  { id: "brand-nordtune", label: "NordTune", kind: "brand", links: ["p1", "p4", "risk-shipping"] },
  { id: "brand-axistech", label: "AxisTech", kind: "brand", links: ["p3", "p6"] },
  { id: "brand-verabio", label: "VeraBio", kind: "brand", links: ["p2", "risk-compliance"] },
  { id: "risk-shipping", label: "Shipping Delay", kind: "risk", links: ["p4"] },
  { id: "risk-compliance", label: "Ingredient Label", kind: "risk", links: ["p2"] },
  { id: "p1", label: "AeroBuds Pro", kind: "product", links: ["brand-nordtune"] },
  { id: "p2", label: "Luma Skin Serum", kind: "product", links: ["brand-verabio", "risk-compliance"] },
  { id: "p3", label: "Volt Travel Charger", kind: "product", links: ["brand-axistech"] },
  { id: "p4", label: "MicroCloud Camera", kind: "product", links: ["brand-nordtune", "risk-shipping"] },
  { id: "p5", label: "Eco Brew Pods", kind: "product", links: [] },
  { id: "p6", label: "Navi Fold Stand", kind: "product", links: ["brand-axistech"] }
];
