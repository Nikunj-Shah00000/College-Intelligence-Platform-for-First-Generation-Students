import { useState } from "react";
import { useGetSurvivalGuide, getGetSurvivalGuideQueryKey } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, BookOpen, User, Users, Briefcase, Star, ChevronDown, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CATEGORY_META: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  exams:      { icon: FileText,  color: "text-destructive",  label: "Exams" },
  electives:  { icon: BookOpen,  color: "text-blue-400",     label: "Electives" },
  professors: { icon: User,      color: "text-yellow-400",   label: "Professors" },
  clubs:      { icon: Users,     color: "text-primary",      label: "Clubs" },
  placements: { icon: Briefcase, color: "text-purple-400",   label: "Placements" },
  "first-year": { icon: Star,   color: "text-cyan-400",     label: "First Year" },
};

const COLLEGES = ["GGSIPU", "DTU"];
const BRANCHES = ["Computer Science", "Electronics", "Mechanical", "Civil Engineering"];

export default function SurvivalGuide() {
  const [college, setCollege] = useState("GGSIPU");
  const [branch, setBranch] = useState("Computer Science");
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["ggsipu-cs-first-year"]));

  const { data: sections, isLoading } = useGetSurvivalGuide(
    { college, branch },
    { query: { queryKey: getGetSurvivalGuideQueryKey({ college, branch }) } }
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tighter uppercase">Survival Guide</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          Auto-generated from verified senior intelligence. The manual nobody gave you.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-1">
          <label className="text-xs font-mono text-muted-foreground uppercase">College</label>
          <div className="flex gap-2">
            {COLLEGES.map((c) => (
              <button
                key={c}
                onClick={() => setCollege(c)}
                className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${
                  college === c
                    ? "bg-primary text-black border-primary"
                    : "bg-secondary border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-mono text-muted-foreground uppercase">Branch</label>
          <div className="flex flex-wrap gap-2">
            {BRANCHES.map((b) => (
              <button
                key={b}
                onClick={() => setBranch(b)}
                className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${
                  branch === b
                    ? "bg-primary text-black border-primary"
                    : "bg-secondary border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-secondary animate-pulse rounded-md border border-border" />
          ))}
        </div>
      ) : !sections || sections.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-mono text-sm">
          No intel found for {branch} at {college} yet. Be the first senior to contribute.
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, sIdx) => {
            const meta = CATEGORY_META[section.category] ?? CATEGORY_META.exams;
            const Icon = meta.icon;
            const isOpen = openSections.has(section.id);

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sIdx * 0.06 }}
                className="bg-card border border-card-border rounded-md overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={meta.color} />
                    <span className="font-mono font-bold text-sm">{section.title}</span>
                    <Badge variant="outline" className="text-xs font-mono text-muted-foreground hidden sm:inline-flex">
                      {section.entries.length} entries
                    </Badge>
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
                        {section.entries.map((entry, eIdx) => (
                          <motion.div
                            key={eIdx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: eIdx * 0.05 }}
                            className="p-4 flex gap-4 items-start"
                          >
                            <div className="w-1 h-full min-h-[2.5rem] bg-primary/30 rounded-full shrink-0 mt-1" />
                            <div className="flex-1 space-y-2">
                              <p className="text-sm leading-relaxed">{entry.text}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-mono text-muted-foreground">— {entry.source}</span>
                                <div className="flex items-center gap-1 text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                                  <ShieldCheck size={11} />
                                  {entry.verifiedBy} confirmed
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
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
