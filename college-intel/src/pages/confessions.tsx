import { useState } from "react";
import { useListConfessions, useCreateConfession, useUpvoteConfession, getListConfessionsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ChevronUp, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["all", "placement", "faculty", "club", "scholarship", "general", "toxic"];

const CAT_COLORS: Record<string, string> = {
  placement:  "bg-purple-400/10 text-purple-400 border-purple-400/30",
  faculty:    "bg-blue-400/10 text-blue-400 border-blue-400/30",
  club:       "bg-primary/10 text-primary border-primary/30",
  scholarship:"bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  general:    "bg-secondary text-muted-foreground border-border",
  toxic:      "bg-destructive/10 text-destructive border-destructive/30",
};

const COLLEGES = ["GGSIPU", "DTU"];
const BRANCHES = ["Computer Science", "Electronics", "Mechanical", "Civil Engineering"];

export default function Confessions() {
  const [filterCat, setFilterCat] = useState("all");
  const [filterCollege, setFilterCollege] = useState<string | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ content: "", college: "GGSIPU", branch: "Computer Science", category: "general" });
  const [upvoted, setUpvoted] = useState<Set<number>>(new Set());

  const queryClient = useQueryClient();

  const { data: confessions, isLoading } = useListConfessions(
    { college: filterCollege },
    { query: { queryKey: getListConfessionsQueryKey({ college: filterCollege }) } }
  );

  const createMutation = useCreateConfession({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListConfessionsQueryKey() });
        setShowForm(false);
        setForm({ content: "", college: "GGSIPU", branch: "Computer Science", category: "general" });
      },
    },
  });

  const upvoteMutation = useUpvoteConfession({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListConfessionsQueryKey() });
      },
    },
  });

  const handleUpvote = (id: number) => {
    if (upvoted.has(id)) return;
    setUpvoted((prev) => new Set([...prev, id]));
    upvoteMutation.mutate({ id });
  };

  const filtered = confessions?.filter((c) => filterCat === "all" || c.category === filterCat) ?? [];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tighter uppercase">What Nobody Tells You</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Anonymous, moderated, and peer-verified confessions from inside the system.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="shrink-0 font-mono text-xs bg-primary text-black hover:bg-primary/90"
        >
          <Plus size={14} className="mr-1" />
          Post Anonymously
        </Button>
      </div>

      {/* Anonymous form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card border border-primary/30 rounded-md p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm uppercase">Anonymous Confession</span>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
            <textarea
              className="w-full bg-secondary border border-border rounded p-3 text-sm font-mono resize-none focus:outline-none focus:border-primary/60 placeholder:text-muted-foreground"
              rows={4}
              placeholder="What does the system not want freshers to know? Be specific."
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">College</label>
                <select
                  className="w-full bg-secondary border border-border rounded p-2 text-xs font-mono focus:outline-none focus:border-primary/60"
                  value={form.college}
                  onChange={(e) => setForm((f) => ({ ...f, college: e.target.value }))}
                >
                  {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Branch</label>
                <select
                  className="w-full bg-secondary border border-border rounded p-2 text-xs font-mono focus:outline-none focus:border-primary/60"
                  value={form.branch}
                  onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
                >
                  {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Category</label>
                <select
                  className="w-full bg-secondary border border-border rounded p-2 text-xs font-mono focus:outline-none focus:border-primary/60"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.filter((c) => c !== "all").map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => createMutation.mutate({ data: form })}
                disabled={!form.content.trim() || form.content.length < 10 || createMutation.isPending}
                className="font-mono text-xs bg-primary text-black hover:bg-primary/90"
              >
                {createMutation.isPending ? "Posting..." : "Post Anonymously"}
              </Button>
              <span className="text-xs font-mono text-muted-foreground">No name, no trace. 100% anonymous.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1 rounded text-xs font-mono border uppercase transition-all ${
              filterCat === cat
                ? "bg-primary text-black border-primary"
                : "bg-secondary border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {cat}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setFilterCollege(undefined)}
            className={`px-3 py-1 rounded text-xs font-mono border transition-all ${
              !filterCollege ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary border-border text-muted-foreground"
            }`}
          >
            All
          </button>
          {COLLEGES.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCollege(c)}
              className={`px-3 py-1 rounded text-xs font-mono border transition-all ${
                filterCollege === c ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary border-border text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="columns-1 md:columns-2 gap-4 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-secondary animate-pulse rounded-md border border-border break-inside-avoid" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-mono text-sm">
          No confessions in this category yet. Be the first to speak up.
        </div>
      ) : (
        <div className="columns-1 md:columns-2 gap-4">
          {filtered.map((confession, idx) => {
            const catColor = CAT_COLORS[confession.category] ?? CAT_COLORS.general;
            const hasUpvoted = upvoted.has(confession.id);

            return (
              <motion.div
                key={confession.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="break-inside-avoid mb-4 bg-card border border-card-border rounded-md p-5 group hover:border-primary/30 transition-colors relative"
              >
                {confession.isVerified && (
                  <div className="absolute top-3 right-3">
                    <ShieldCheck size={14} className="text-primary" />
                  </div>
                )}

                <p className="text-sm leading-relaxed mb-4 pr-5">{confession.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs font-mono uppercase ${catColor}`}>
                      {confession.category}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">// {confession.college}</span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleUpvote(confession.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono border transition-all ${
                      hasUpvoted
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    <ChevronUp size={12} />
                    <motion.span
                      key={confession.upvoteCount}
                      initial={{ y: -4, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      {confession.upvoteCount}
                    </motion.span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
