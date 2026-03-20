import type { FilterState, RiskLevel } from "../types";

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
}

const riskOptions: Array<RiskLevel | "all"> = ["all", "low", "medium", "high", "critical"];

export function FilterBar({ value, onChange }: Props) {
  return (
    <section className="neu-card mb-4 grid grid-cols-1 gap-3 p-4 md:grid-cols-4">
      <input
        value={value.query}
        placeholder="搜索任务或消息"
        onChange={(event) => onChange({ ...value, query: event.target.value })}
        className="neu-input"
      />
      <select value={value.region} onChange={(event) => onChange({ ...value, region: event.target.value as FilterState["region"] })} className="neu-input">
        <option value="all">全部区域</option>
        <option value="north">北区</option>
        <option value="south">南区</option>
        <option value="east">东区</option>
        <option value="west">西区</option>
      </select>
      <select value={value.risk} onChange={(event) => onChange({ ...value, risk: event.target.value as RiskLevel | "all" })} className="neu-input">
        {riskOptions.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
      <select value={value.sort} onChange={(event) => onChange({ ...value, sort: event.target.value as FilterState["sort"] })} className="neu-input">
        <option value="priority">按风险排序</option>
        <option value="updated">按更新时间</option>
      </select>
    </section>
  );
}
