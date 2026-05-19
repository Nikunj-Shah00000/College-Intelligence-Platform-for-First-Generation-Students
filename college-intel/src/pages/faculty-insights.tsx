import { useState } from "react";
import {
  useListFacultyInsights,
  useCreateFacultyInsight,
  useVerifyFacultyInsight,
  getListFacultyInsightsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ChevronDown, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TYPE_META: Record<string, { label: string; color: string }> = {
  contact:       { label: "Contact",      color: "bg-orange-400/10 text-orange-400 border-orange-400/30" },
  lor:           { label: "LOR",          color: "bg-purple-400/10 text-purple-400 border-purple-400/30" },
  "office-hours":{ label: "Office Hours", color: "bg-primary/10 text-primary border-primary/30" },
  exam:          { label: "Exam",         color: "bg-destructive/10 text-destructive border-destructive/30" },
  general:       { label: "General",      color: "bg-secondary text-muted-foreground border-border" },
};

const TYPES = ["contact", "lor", "office-hours", "exam", "general"];
const COLLEGES = ["GGSIPU", "DTU"];
const BRANCHES = ["Computer Science", "Electronics", "Mechanical", "Civil Engineering"];

export default function FacultyInsights() {
  const [college, setCollege] = useState("GGSIPU");
  const [branch, setBranch] = useState("Computer Science");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [openProfs, setOpenProfs] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    professorName: "", college: "GGSIPU", branch: "Computer Science",
    department: "", insight: "", insightType: "general",
  });
  const [confirmed, setConfirmed] = useState<Set<number>>(new Set());

  const queryClient = useQueryClient();

  const { data: insights, isLoading } = useListFacultyInsights(
    { college, branch },
    { query: { queryKey: getListFacultyInsightsQueryKey({ college, branch }) } }
  );

  const createMutation = useCreateFacultyInsight({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListFacultyInsightsQueryKey() });
        setShowForm(false);
        setForm({ professorName: "", college: "GGSIPU", branch: "Computer Science", department: "", insight: "", insightType: "general" });
      },
    },
  });

  const verifyMutation = useVerifyFacultyInsight({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListFacultyInsightsQueryKey() });
      },
    },
  });

  const handleConfirm = (id: number) => {
    if (confirmed.has(id)) return;
    setConfirmed((prev) => new Set([...prev, id]));
    verifyMutation.mutate({ id });
  };

  const toggleProf = (name: string) => {
    setOpenProfs((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  // Group by professor
  const filtered = (insights ?? [])
    .filter((i) => typeFilter === "all" || i.insightType === typeFilter)
    .filter((i) => !search || i.professorName.toLowerCase().includes(search.toLowerCase()));

  const grouped: Record<string, typeof filtered> = {};
  filtered.forEach((insight) => {
    if (!grouped[insight.professorName]) grouped[insight.professorName] = [];
    grouped[insight.professorName].push(insight);
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tighter uppercase">Office Hour Intelligence</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Crowdsourced faculty behavior insights. The invisible curriculum, documented.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="shrink-0 font-mono text-xs bg-primary text-black hover:bg-primary/90"
        >
          <Plus size={14} className="mr-1" />
          Add Insight
        </Button>
      </div>

      {/* Add Insight Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card border border-primary/30 rounded-md p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm uppercase">Add Faculty Intel</span>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "Professor Name", key: "professorName", type: "input" },
                { label: "Department", key: "department", type: "input" },
              ].map(({ label, key }) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase">{label}</label>
                  <input
                    className="w-full bg-secondary border border-border rounded p-2 text-xs font-mono focus:outline-none focus:border-primary/60"
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase">Type</label>
                <select
                  className="w-full bg-secondary border border-border rounded p-2 text-xs font-mono focus:outline-none focus:border-primary/60"
                  value={form.insightType}
                  onChange={(e) => setForm((f) => ({ ...f, insightType: e.target.value }))}
                >
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
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
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground uppercase">Insight</label>
              <textarea
                className="w-full bg-secondary border border-border rounded p-3 text-sm font-mono resize-none focus:outline-none focus:border-primary/60"
                rows={3}
                placeholder="What does everyone know but nobody documents?"
                value={form.insight}
                onChange={(e) => setForm((f) => ({ ...f, insight: e.target.value }))}
              />
            </div>
            <Button
              onClick={() => createMutation.mutate({ data: form })}
              disabled={!form.professorName || !form.insight || form.insight.length < 10 || createMutation.isPending}
              className="font-mono text-xs bg-primary text-black hover:bg-primary/90"
            >
              {createMutation.isPending ? "Submitting..." : "Submit Intel"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          className="bg-secondary border border-border rounded px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-primary/60 placeholder:text-muted-foreground w-48"
          placeholder="Search professor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {["all", ...TYPES].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded text-xs font-mono border uppercase transition-all ${
                typeFilter === t
                  ? "bg-primary text-black border-primary"
                  : "bg-secondary border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          {COLLEGES.map((c) => (
            <button
              key={c}
              onClick={() => setCollege(c)}
              className={`px-3 py-1 rounded text-xs font-mono border transition-all ${
                college === c ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary border-border text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-secondary animate-pulse rounded-md border border-border" />)}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-mono text-sm">
          No faculty insights found. Add the first one.
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([profName, profInsights], pIdx) => {
            const isOpen = openProfs.has(profName);
            return (
              <motion.div
                key={profName}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pIdx * 0.07 }}
                className="bg-card border border-card-border rounded-md overflow-hidden"
              >
                <button
                  onClick={() => toggleProf(profName)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm">{profName}</span>
                    <Badge variant="outline" className="text-xs font-mono text-muted-foreground">
                      {profInsights.length} insights
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground hidden sm:block">
                      // {profInsights[0].department ?? profInsights[0].branch}
                    </span>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-muted-foreground" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border divide-y divide-border">
                        {profInsights.map((insight, iIdx) => {
                          const typeMeta = TYPE_META[insight.insightType] ?? TYPE_META.general;
                          const hasConfirmed = confirmed.has(insight.id);
                          return (
                            <motion.div
                              key={insight.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: iIdx * 0.04 }}
                              className="p-4 flex gap-4 items-start"
                            >
                              <div className="w-1 min-h-[2rem] bg-primary/20 rounded-full shrink-0 mt-1.5" />
                              <div className="flex-1 space-y-2">
                                <p className="text-sm leading-relaxed">{insight.insight}</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge variant="outline" className={`text-xs font-mono uppercase ${typeMeta.color}`}>
                                    {typeMeta.label}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                                    <ShieldCheck size={11} />
                                    {insight.verificationCount} confirmed
                                  </div>
                                  <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => handleConfirm(insight.id)}
                                    disabled={hasConfirmed}
                                    className={`text-xs font-mono px-2 py-0.5 rounded border transition-all ${
                                      hasConfirmed
                                        ? "border-primary/30 text-primary cursor-default"
                                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                                    }`}
                                  >
                                    {hasConfirmed ? "Confirmed" : "Confirm"}
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
