import { useState } from "react";
import { useListTips, useGetNudges, getGetNudgesQueryKey } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ShieldCheck, Flame, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

const URGENCY_COLORS: Record<string, string> = {
  critical: "bg-destructive/20 text-destructive border-destructive/40",
  high:     "bg-orange-400/10 text-orange-400 border-orange-400/30",
  medium:   "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  low:      "bg-secondary text-muted-foreground border-border",
};

const NUDGE_BORDER: Record<string, string> = {
  critical: "border-destructive/50 bg-destructive/5",
  high:     "border-orange-400/50 bg-orange-400/5",
  medium:   "border-yellow-400/40 bg-yellow-400/5",
};

const NUDGE_TEXT: Record<string, string> = {
  critical: "text-destructive",
  high:     "text-orange-400",
  medium:   "text-yellow-400",
};

const CATEGORIES = ["all", "scholarship", "faculty", "club", "department", "placement", "general"];

export default function Home() {
  const [catFilter, setCatFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [nudgeIdx, setNudgeIdx] = useState(0);

  const { data: tips, isLoading } = useListTips({});
  const { data: nudges } = useGetNudges(
    { college: "GGSIPU", branch: "Computer Science" },
    { query: { queryKey: getGetNudgesQueryKey({ college: "GGSIPU", branch: "Computer Science" }) } }
  );

  const filtered = (tips ?? []).filter((t) => {
    if (catFilter !== "all" && t.category !== catFilter) return false;
    if (urgencyFilter !== "all" && t.urgency !== urgencyFilter) return false;
    return true;
  });

  const currentNudge = nudges?.[nudgeIdx % (nudges?.length || 1)];
  const hasNudges = nudges && nudges.length > 0;

  return (
    <div className="space-y-6">
      {/* AI Nudge Banner */}
      {hasNudges && currentNudge && (
        <div className={`border rounded-md p-4 flex items-start gap-4 transition-colors ${NUDGE_BORDER[currentNudge.urgency] ?? "border-border bg-secondary/30"}`}>
          <Zap className={`shrink-0 mt-0.5 ${NUDGE_TEXT[currentNudge.urgency] ?? "text-muted-foreground"}`} size={16} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-mono font-bold uppercase tracking-wider ${NUDGE_TEXT[currentNudge.urgency] ?? "text-muted-foreground"}`}>
                You Are About to Miss This
              </span>
              <Badge variant="outline" className={`text-xs font-mono uppercase ${NUDGE_BORDER[currentNudge.urgency]}`}>
                Expires in {currentNudge.expiresInHours}h
              </Badge>
            </div>
            <p className="text-sm text-foreground leading-snug">{currentNudge.message}</p>
            <div className="mt-2 flex items-center gap-3">
              {currentNudge.tipId ? (
                <Link href={`/tip/${currentNudge.tipId}`}>
                  <span className={`text-xs font-mono underline underline-offset-2 cursor-pointer ${NUDGE_TEXT[currentNudge.urgency]}`}>
                    {currentNudge.actionLabel}
                  </span>
                </Link>
              ) : (
                <span className={`text-xs font-mono ${NUDGE_TEXT[currentNudge.urgency]}`}>{currentNudge.actionLabel}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setNudgeIdx((i) => (i - 1 + nudges.length) % nudges.length)}
              className="p-1 rounded hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-mono text-muted-foreground">{nudgeIdx + 1}/{nudges.length}</span>
            <button
              onClick={() => setNudgeIdx((i) => (i + 1) % nudges.length)}
              className="p-1 rounded hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          {/* Feed Header + Filters */}
          <div className="flex flex-col gap-3 border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-mono tracking-tight flex items-center gap-2">
                <Flame className="text-accent" size={22} /> LIVE FEED
              </h2>
              <span className="text-xs font-mono text-muted-foreground">{filtered.length} Intel Items</span>
            </div>
            {/* Category filter */}
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatFilter(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-mono border uppercase transition-all ${
                    catFilter === cat
                      ? "bg-primary text-black border-primary"
                      : "bg-secondary border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Urgency filter */}
            <div className="flex gap-1.5 flex-wrap">
              {["all", "critical", "high", "medium", "low"].map((u) => (
                <button
                  key={u}
                  onClick={() => setUrgencyFilter(u)}
                  className={`px-2.5 py-0.5 rounded text-xs font-mono border uppercase transition-all ${
                    urgencyFilter === u
                      ? u === "all" ? "bg-primary text-black border-primary" : URGENCY_COLORS[u]
                      : "bg-secondary border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-secondary animate-pulse rounded-md border border-border" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground font-mono text-sm">
              No intel found for this filter combination.
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((tip, idx) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.06, type: "spring", stiffness: 160, damping: 20 }}
                  className="bg-card border border-card-border p-5 rounded-md hover:border-primary/50 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors duration-300" />

                  {/* Pulsing glow for critical */}
                  {tip.urgency === "critical" && (
                    <div className="absolute top-3 right-3 w-2 h-2 bg-destructive rounded-full pulsing-glow" />
                  )}

                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`font-mono text-xs uppercase ${URGENCY_COLORS[tip.urgency] ?? ""}`}>
                        {tip.urgency}
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground">{tip.category}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                      <Clock size={11} />
                      {new Date(tip.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <Link href={`/tip/${tip.id}`}>
                    <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors cursor-pointer leading-snug">
                      {tip.title}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{tip.content}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                        <ShieldCheck size={12} />
                        {tip.verificationCount} verified
                      </div>
                      {tip.deadline && (
                        <div className="flex items-center gap-1 text-xs font-mono text-accent">
                          <Clock size={12} />
                          DUE: {new Date(tip.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                      // {tip.college} — {tip.branch}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Sidebar panel */}
        <div className="w-full md:w-72 space-y-4">
          <div className="bg-secondary/50 border border-border p-4 rounded-md">
            <h3 className="font-mono font-bold text-xs mb-3 uppercase tracking-wider text-muted-foreground">System Status</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span>Network Verification</span>
                  <span className="text-primary">98%</span>
                </div>
                <div className="h-0.5 bg-background rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "98%" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span>Active Threats</span>
                  <span className="text-destructive">{nudges?.filter((n) => n.urgency === "critical").length ?? 0}</span>
                </div>
                <div className="h-0.5 bg-background rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-destructive rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(((nudges?.filter((n) => n.urgency === "critical").length ?? 0) / 5) * 100, 100)}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-secondary/50 border border-border p-4 rounded-md">
            <h3 className="font-mono font-bold text-xs mb-3 uppercase tracking-wider text-muted-foreground">Deep Intel</h3>
            <div className="space-y-2">
              {[
                { href: "/roadmap", label: "Your Roadmap" },
                { href: "/power-map", label: "Campus Power Map" },
                { href: "/survival-guide", label: "Survival Guide" },
                { href: "/confessions", label: "What Nobody Says" },
                { href: "/faculty-insights", label: "Faculty Intel" },
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors cursor-pointer py-1 border-b border-border/50 last:border-0 flex items-center justify-between group">
                    {link.label}
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
