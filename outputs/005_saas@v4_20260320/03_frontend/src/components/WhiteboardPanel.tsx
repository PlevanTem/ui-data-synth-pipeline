interface Props {
  selectedNodeId: string | null;
  onPickNode: (nodeId: string) => void;
}

const nodes = ["n1", "n2", "n3", "n4"];

export function WhiteboardPanel({ selectedNodeId, onPickNode }: Props) {
  return (
    <section className="neu-card p-4">
      <h2 className="mb-3 text-lg font-semibold">实时协作白板</h2>
      <div className="grid grid-cols-2 gap-3">
        {nodes.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onPickNode(id)}
            className={"rounded-xl p-4 text-left " + (selectedNodeId === id ? "bg-accent-info text-white" : "bg-surface")}
          >
            节点 {id.toUpperCase()}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-text-secondary">点击节点后，聊天会自动定位对应线程。</p>
    </section>
  );
}
