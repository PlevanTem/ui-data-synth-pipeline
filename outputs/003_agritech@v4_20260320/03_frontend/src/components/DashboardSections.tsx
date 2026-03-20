import type { FilterState, WorkflowNode } from '../types/app'

type Props = {
  filter: FilterState
  onFilter: (next: FilterState) => void
  selectedAsset: string
  onSelectAsset: (id: string) => void
  nodes: WorkflowNode[]
  onMoveNode: (id: string, x: number, y: number) => void
  onPublish: () => void
  submitStatus: 'idle' | 'loading' | 'success' | 'error'
  onSubmitLead: (ev: React.FormEvent<HTMLFormElement>) => void
}

export function DashboardSections(props: Props) {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-20 pt-24 md:px-6">
      <section id="overview" className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-6">
        <h1 className="font-['Syncopate'] text-3xl">AgriFlow Command</h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">资源调度不均实时指挥中枢</p>
      </section>
      <section id="command" className="grid gap-4 md:grid-cols-3">
        <select value={props.filter.region} onChange={(e) => props.onFilter({ ...props.filter, region: e.target.value as FilterState['region'] })} className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2"><option>north</option><option>central</option><option>south</option></select>
        <select value={props.filter.resourceType} onChange={(e) => props.onFilter({ ...props.filter, resourceType: e.target.value as FilterState['resourceType'] })} className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2"><option>machine</option><option>team</option><option>vehicle</option></select>
        <select value={props.filter.timeRange} onChange={(e) => props.onFilter({ ...props.filter, timeRange: e.target.value as FilterState['timeRange'] })} className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2"><option>24h</option><option>7d</option><option>30d</option></select>
      </section>
      <section id="workflow" className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-5">
        <button onClick={props.onPublish} className="mb-3 rounded bg-[var(--color-primary)] px-3 py-2">发布流程</button>
        <div className="relative h-40 rounded border border-dashed border-[var(--color-border)]">
          {props.nodes.map((n) => <button key={n.id} style={{ left: n.x, top: n.y }} className="absolute rounded border border-[var(--color-accent-cyan)] px-2 py-1" onClick={() => props.onMoveNode(n.id, n.x + 8, n.y + 6)}>{n.label}</button>)}
        </div>
      </section>
      <section id="geo" className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-5">
        <button className="rounded bg-[var(--color-accent-cyan)]/30 px-3 py-2" onClick={() => props.onSelectAsset('geo-point-A')}>热区脉冲点</button>
        <p className="mt-2 text-[var(--color-text-secondary)]">当前选中：{props.selectedAsset}</p>
      </section>
      <section id="cta" className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/85 p-6">
        <form className="grid gap-3 md:grid-cols-2" onSubmit={props.onSubmitLead}>
          <input required name="name" placeholder="姓名" className="rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2" />
          <input required name="email" type="email" placeholder="邮箱" className="rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2" />
          <button disabled={props.submitStatus === 'loading'} className="md:col-span-2 rounded-md bg-[var(--color-primary)] px-4 py-2">{props.submitStatus === 'loading' ? '提交中...' : '提交咨询'}</button>
        </form>
      </section>
    </div>
  )
}
