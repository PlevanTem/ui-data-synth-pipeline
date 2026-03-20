interface Props {
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  onRetry: () => void;
}

export function StatusPanel({ loading, error, isEmpty, onRetry }: Props) {
  if (loading) {
    return <div className="neu-card p-4 text-sm text-text-secondary">加载中...</div>;
  }
  if (error) {
    return (
      <div className="neu-card p-4 text-sm text-accent-danger">
        {error}
        <button onClick={onRetry} type="button" className="ml-3 rounded-full bg-accent-danger px-3 py-1 text-white">重试</button>
      </div>
    );
  }
  if (isEmpty) {
    return <div className="neu-card p-4 text-sm text-text-secondary">当前筛选无数据，请调整条件。</div>;
  }
  return null;
}
