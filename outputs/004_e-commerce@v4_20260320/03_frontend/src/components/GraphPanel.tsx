import type { GraphNode } from "../types";

interface Props {
  nodes: GraphNode[];
  selectedNode: string | null;
  onSelectNode: (id: string) => void;
  loading: boolean;
}

export function GraphPanel({ nodes, selectedNode, onSelectNode, loading }: Props) {
  return (
    <section className="glass block" id="graph">
      <div className="panel-title-row">
        <h2>知识图谱探索</h2>
        {loading && <span className="badge">更新中</span>}
      </div>
      <p>点击节点可过滤商品并更新风险说明。此处展示可交互关系摘要（生产环境可替换为 WebGL 层）。</p>
      <div className="node-grid" role="list">
        {nodes.map((node) => (
          <button
            key={node.id}
            className={node.id === selectedNode ? "node active" : "node"}
            onClick={() => onSelectNode(node.id)}
            role="listitem"
            aria-pressed={node.id === selectedNode}
          >
            <strong>{node.label}</strong>
            <small>{node.kind}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
