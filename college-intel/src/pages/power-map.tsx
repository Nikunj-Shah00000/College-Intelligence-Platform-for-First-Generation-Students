import { useState, useMemo } from "react";
import { useGetPowerMap, getGetPowerMapQueryKey } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";

const TYPE_COLORS: Record<string, { fill: string; text: string; border: string }> = {
  club:      { fill: "#00ff64", text: "#000",    border: "#00ff64" },
  professor: { fill: "#60a5fa", text: "#000",    border: "#60a5fa" },
  company:   { fill: "#facc15", text: "#000",    border: "#facc15" },
  lab:       { fill: "#22d3ee", text: "#000",    border: "#22d3ee" },
  pipeline:  { fill: "#c084fc", text: "#000",    border: "#c084fc" },
};

const LEGEND = [
  { type: "club",      label: "Student Club" },
  { type: "professor", label: "Professor" },
  { type: "company",   label: "Company" },
  { type: "lab",       label: "Research Lab" },
  { type: "pipeline",  label: "Pipeline" },
];

export default function PowerMap() {
  const [college, setCollege] = useState("GGSIPU");
  const [hovered, setHovered] = useState<string | null>(null);

  const { data: mapData, isLoading } = useGetPowerMap(
    { college },
    { query: { queryKey: getGetPowerMapQueryKey({ college }) } }
  );

  const nodes = mapData?.nodes ?? [];
  const edges = mapData?.edges ?? [];

  // Compute radial positions for nodes
  const svgWidth = 680;
  const svgHeight = 480;
  const cx = svgWidth / 2;
  const cy = svgHeight / 2;
  const radius = 180;

  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number; r: number }> = {};
    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
      // Center node (highest value) stays near center
      const isCenter = node.value === Math.max(...nodes.map((n) => n.value));
      const dist = isCenter ? 0 : radius + (Math.sin(i * 1.3) * 30);
      const x = cx + (isCenter ? 0 : Math.cos(angle) * dist);
      const y = cy + (isCenter ? 0 : Math.sin(angle) * dist);
      const r = 16 + (node.value / 100) * 32;
      positions[node.id] = { x, y, r };
    });
    return positions;
  }, [nodes, cx, cy, radius]);

  const hoveredNode = nodes.find((n) => n.id === hovered);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tighter uppercase">Campus Power Map</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          The invisible network that determines who gets opportunities.
        </p>
      </div>

      {/* College selector */}
      <div className="flex gap-2">
        {["GGSIPU", "DTU"].map((c) => (
          <button
            key={c}
            onClick={() => setCollege(c)}
            className={`px-4 py-2 rounded font-mono text-sm border transition-all ${
              college === c
                ? "bg-primary text-black border-primary shadow-[0_0_12px_rgba(0,255,100,0.4)]"
                : "bg-secondary border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* SVG Map */}
      <div className="bg-card border border-card-border rounded-md overflow-hidden relative">
        {isLoading ? (
          <div className="h-[480px] flex items-center justify-center">
            <div className="font-mono text-muted-foreground text-sm animate-pulse">Mapping network...</div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={college} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <svg width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ display: "block" }}>
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(240 10% 15%)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Edges */}
                {edges.map((edge, i) => {
                  const from = nodePositions[edge.source];
                  const to = nodePositions[edge.target];
                  if (!from || !to) return null;
                  const isHighlighted = hovered === edge.source || hovered === edge.target;
                  return (
                    <motion.line
                      key={i}
                      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                      stroke={isHighlighted ? "#00ff64" : "hsl(240 10% 25%)"}
                      strokeWidth={isHighlighted ? 2 : 1}
                      strokeOpacity={isHighlighted ? 0.8 : 0.4}
                      strokeDasharray={isHighlighted ? "none" : "4 4"}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                    />
                  );
                })}

                {/* Nodes */}
                {nodes.map((node, i) => {
                  const pos = nodePositions[node.id];
                  if (!pos) return null;
                  const colors = TYPE_COLORS[node.type] ?? TYPE_COLORS.club;
                  const isHovered = hovered === node.id;

                  return (
                    <motion.g
                      key={node.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.07, type: "spring", stiffness: 200, damping: 15 }}
                      style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                      onMouseEnter={() => setHovered(node.id)}
                      onMouseLeave={() => setHovered(null)}
                      className="cursor-pointer"
                    >
                      {isHovered && (
                        <circle
                          cx={pos.x} cy={pos.y} r={pos.r + 8}
                          fill="none"
                          stroke={colors.fill}
                          strokeWidth={1}
                          strokeOpacity={0.4}
                        />
                      )}
                      <circle
                        cx={pos.x} cy={pos.y} r={pos.r}
                        fill={colors.fill}
                        fillOpacity={isHovered ? 1 : 0.85}
                        stroke={colors.border}
                        strokeWidth={isHovered ? 2 : 1}
                      />
                      <text
                        x={pos.x} y={pos.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={Math.max(8, Math.min(12, pos.r * 0.45))}
                        fontFamily="Space Mono, monospace"
                        fontWeight="bold"
                        fill={colors.text}
                      >
                        {node.label.split(" ").slice(0, 2).join(" ")}
                      </text>
                      {node.placementRate != null && (
                        <text
                          x={pos.x} y={pos.y + pos.r + 14}
                          textAnchor="middle"
                          fontSize={9}
                          fontFamily="Space Mono, monospace"
                          fill="#00ff64"
                          fillOpacity={0.7}
                        >
                          {node.placementRate}% placed
                        </text>
                      )}
                    </motion.g>
                  );
                })}
              </svg>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Hover tooltip */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute top-4 right-4 bg-card border border-primary/30 rounded-md p-4 max-w-xs shadow-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: TYPE_COLORS[hoveredNode.type]?.fill ?? "#fff" }}
                />
                <span className="font-mono font-bold text-sm">{hoveredNode.label}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{hoveredNode.description}</p>
              {hoveredNode.placementRate != null && (
                <div className="mt-2 font-mono text-xs text-primary">{hoveredNode.placementRate}% placement rate</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {LEGEND.map((item) => (
          <div key={item.type} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: TYPE_COLORS[item.type]?.fill }} />
            <span className="text-xs font-mono text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
