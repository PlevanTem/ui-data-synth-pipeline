import type { ProductItem } from "../types";

interface Props {
  items: ProductItem[];
  selectedProductId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
}

export function ResultList({ items, selectedProductId, onSelect, loading }: Props) {
  if (loading) {
    return <section className="glass block">正在加载候选商品...</section>;
  }

  if (items.length === 0) {
    return (
      <section className="glass block" role="status">
        无匹配结果。请放宽价格区间或降低信誉阈值。
      </section>
    );
  }

  return (
    <section className="glass block">
      <h2>候选商品</h2>
      <div className="card-grid">
        {items.map((item) => (
          <button
            key={item.id}
            className={item.id === selectedProductId ? "card active" : "card"}
            onClick={() => onSelect(item.id)}
          >
            <h4>{item.title}</h4>
            <p>{item.brand} · {item.country}</p>
            <p>${item.price} · Trust {item.trust}</p>
            {!item.inStock && <span className="badge danger">缺货</span>}
          </button>
        ))}
      </div>
    </section>
  );
}
