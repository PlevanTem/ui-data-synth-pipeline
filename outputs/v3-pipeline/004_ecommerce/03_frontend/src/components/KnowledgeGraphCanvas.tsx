import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  image: string;
  name: string;
  r: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  value: number;
}

export const KnowledgeGraphCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { products, selectedNode, setSelectedNode } = useStore();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const newNodes: Node[] = products.map((p, i) => ({
      id: p.id,
      group: i,
      image: p.image,
      name: p.name,
      r: 30,
      x: Math.random() * 800,
      y: Math.random() * 600
    }));

    const newLinks: Link[] = [];
    products.forEach(p => {
      p.relatedIds.forEach(targetId => {
        if (products.find(prod => prod.id === targetId)) {
          newLinks.push({ source: p.id, target: targetId, value: 1 });
        }
      });
    });

    setNodes(newNodes);
    setLinks(newLinks);
  }, [products]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const width = canvas.width;
    const height = canvas.height;

    simulationRef.current = d3.forceSimulation<Node, Link>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id((d: Node) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide<Node>().radius((d) => (d as Node).r + 10))
      .on("tick", ticked);

    function ticked() {
      if (!context) return;
      context.clearRect(0, 0, width, height);

      context.strokeStyle = "rgba(255, 255, 255, 0.2)";
      context.lineWidth = 1;
      links.forEach(link => {
        const source = link.source as Node;
        const target = link.target as Node;
        if (source.x != null && source.y != null && target.x != null && target.y != null) {
          context.beginPath();
          context.moveTo(source.x, source.y);
          context.lineTo(target.x, target.y);
          context.stroke();
        }
      });

      nodes.forEach(node => {
        if (node.x == null || node.y == null) return;
        context.beginPath();
        context.arc(node.x, node.y, node.r, 0, 2 * Math.PI);
        context.fillStyle = selectedNode === node.id ? "#F97316" : "#3B82F6";
        context.fill();
        context.strokeStyle = "#fff";
        context.lineWidth = 2;
        context.stroke();
        context.font = "12px Inter";
        context.fillStyle = "#fff";
        context.textAlign = "center";
        context.fillText(node.name, node.x, node.y + node.r + 15);
      });
    }

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      let clickedNode: Node | null = null;
      for (const node of nodes) {
        if (node.x == null || node.y == null) continue;
        const dx = x - node.x;
        const dy = y - node.y;
        if (dx * dx + dy * dy < node.r * node.r) {
          clickedNode = node;
          break;
        }
      }

      if (clickedNode) {
        setSelectedNode(clickedNode.id);
        simulationRef.current?.alpha(1).restart();
      } else {
        setSelectedNode(null);
      }
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      simulationRef.current?.stop();
      canvas.removeEventListener('click', handleClick);
    };
  }, [nodes, links, selectedNode, setSelectedNode]);

  return (
    <div className="relative w-full h-[600px] glass-panel overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      <div className="absolute top-4 left-4 pointer-events-none">
        <h3 className="text-white font-semibold">Knowledge Graph</h3>
        <p className="text-white/50 text-xs">Tap nodes to explore related products</p>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-4 left-4 right-4 glass-panel p-4 flex items-center justify-between"
          >
            <div>
              <h4 className="text-white font-bold">{products.find(p => p.id === selectedNode)?.name}</h4>
              <p className="text-accent text-sm">${products.find(p => p.id === selectedNode)?.price}</p>
            </div>
            <button
              onClick={() => selectedNode && navigate(`/product/${selectedNode}`)}
              className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-full text-sm transition-colors"
            >
              View Details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
