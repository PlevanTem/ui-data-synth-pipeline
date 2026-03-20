interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  total: number;
  loading: boolean;
}

export function SearchPanel({ query, onQueryChange, total, loading }: Props) {
  return (
    <section className="glass block" id="search">
      <h2>语义搜索</h2>
      <p>输入“轻便旅行充电”或“敏感肌可用精华”等语义词，结果会同步驱动图谱与商品区。</p>
      <div className="search-row">
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="输入语义搜索词"
          aria-label="语义搜索输入"
        />
        <button disabled={loading}>{loading ? "搜索中" : "立即搜索"}</button>
      </div>
      <div className="status-line">{loading ? "正在更新候选集..." : `已匹配 ${total} 个候选`}</div>
    </section>
  );
}
