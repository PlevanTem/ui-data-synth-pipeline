import type { SearchFilters } from "../types";

interface Props {
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
}

export function FilterDrawer({ filters, onChange }: Props) {
  return (
    <section className="glass block filter-block">
      <h3>筛选</h3>
      <label>
        价格下限
        <input
          type="number"
          inputMode="numeric"
          value={filters.minPrice}
          onChange={(event) => onChange({ ...filters, minPrice: Number(event.target.value) })}
        />
      </label>
      <label>
        价格上限
        <input
          type="number"
          inputMode="numeric"
          value={filters.maxPrice}
          onChange={(event) => onChange({ ...filters, maxPrice: Number(event.target.value) })}
        />
      </label>
      <label>
        发货地
        <select value={filters.country} onChange={(event) => onChange({ ...filters, country: event.target.value })}>
          <option value="all">全部</option>
          <option value="JP">日本</option>
          <option value="KR">韩国</option>
          <option value="US">美国</option>
          <option value="DE">德国</option>
          <option value="SG">新加坡</option>
        </select>
      </label>
      <label>
        {"品牌信誉 >= "}{filters.trustLevel}
        <input
          type="range"
          min={60}
          max={95}
          value={filters.trustLevel}
          onChange={(event) => onChange({ ...filters, trustLevel: Number(event.target.value) })}
        />
      </label>
    </section>
  );
}
