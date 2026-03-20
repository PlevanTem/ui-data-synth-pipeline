import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS, GRAPH_NODES } from "./data";
import { TopNav } from "./components/TopNav";
import { SearchPanel } from "./components/SearchPanel";
import { FilterDrawer } from "./components/FilterDrawer";
import { GraphPanel } from "./components/GraphPanel";
import { ResultList } from "./components/ResultList";
import { CheckoutWizard } from "./components/CheckoutWizard";
import { ToastHost, type ToastItem } from "./components/ToastHost";
import { FlowFieldCanvas } from "./generative/FlowFieldCanvas";
import type { CheckoutForm, SearchFilters, ValidationErrors } from "./types";

const initialFilters: SearchFilters = { minPrice: 0, maxPrice: 500, country: "all", trustLevel: 75 };

const initialForm: CheckoutForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  paymentMethod: "card",
};

export default function App() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pushToast = (kind: ToastItem["kind"], text: string) => {
    const id = Date.now() + Math.round(Math.random() * 999);
    setToasts((prev) => [...prev, { id, kind, text }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((item) => item.id !== id)), 2800);
  };

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 320);
    return () => window.clearTimeout(timer);
  }, [query, filters, selectedNode]);

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return PRODUCTS.filter((item) => {
      const queryOk = !lower || [item.title, item.brand, ...item.tags].join(" ").toLowerCase().includes(lower);
      const priceOk = item.price >= filters.minPrice && item.price <= filters.maxPrice;
      const countryOk = filters.country === "all" || item.country === filters.country;
      const trustOk = item.trust >= filters.trustLevel;
      const nodeOk = !selectedNode || item.id === selectedNode || item.brand.toLowerCase().includes(selectedNode.replace("brand-", ""));
      return queryOk && priceOk && countryOk && trustOk && nodeOk;
    }).sort((a, b) => b.trust - a.trust);
  }, [query, filters, selectedNode]);

  const jump = (section: string) => {
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      if (Object.keys(errors).length > 0) {
        pushToast("error", "提交失败，请先修正表单错误");
      } else {
        pushToast("success", "订单已提交，正在同步跨境物流信息");
      }
    }, 900);
  };

  return (
    <div className="app-shell">
      <FlowFieldCanvas intensity={loading ? 1 : 0.4} />
      <TopNav onJump={jump} />
      <main>
        <SearchPanel query={query} onQueryChange={setQuery} total={filtered.length} loading={loading} />
        <div className="layout-grid">
          <FilterDrawer filters={filters} onChange={setFilters} />
          <GraphPanel
            nodes={GRAPH_NODES}
            selectedNode={selectedNode}
            onSelectNode={(id) => {
              setSelectedNode(id);
              pushToast("info", `已聚焦节点：${id}`);
            }}
            loading={loading}
          />
          <ResultList
            items={filtered}
            selectedProductId={selectedProductId}
            onSelect={(id) => {
              setSelectedProductId(id);
              pushToast("warning", `已选择商品 ${id}，图谱已同步高亮`);
            }}
            loading={loading}
          />
        </div>
        <CheckoutWizard
          form={form}
          errors={errors}
          isSubmitting={isSubmitting}
          onFormChange={setForm}
          onErrorsChange={setErrors}
          onSubmit={handleSubmit}
        />
      </main>
      <AnimatePresence>
        {toasts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <ToastHost toasts={toasts} onClose={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
