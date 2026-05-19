import { useState } from "react";
import { useGetRoadmap, getGetRoadmapQueryKey } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Users, FileText, Trophy, FlaskConical, CheckCircle, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const GOALS = [
  { id: "google-internship", label: "FAANG Internship" },
  { id: "research", label: "Research / RA" },
  { id: "startup", label: "Startup Path" },
  { id: "placement", label: "Campus Placement" },
];

const CATEGORY_META: Record<string, { color: string; icon: React.ElementType; bg: string }> = {
  skill:    { color: "text-blue-400",   icon: Code,         bg: "bg-blue-400/10 border-blue-400/30" },
  network:  { color: "text-primary",    icon: Users,        bg: "bg-primary/10 border-primary/30" },
  apply:    { color: "text-yellow-400", icon: FileText,     bg: "bg-yellow-400/10 border-yellow-400/30" },
  compete:  { color: "text-purple-400", icon: Trophy,       bg: "bg-purple-400/10 border-purple-400/30" },
  research: { color: "text-cyan-400",   icon: FlaskConical, bg: "bg-cyan-400/10 border-cyan-400/30" },
};

export default function Roadmap() {
  const [goal, setGoal] = useState("google-internship");
  const { data: roadmap, isLoading } = useGetRoadmap(
    { goal },
    { query: { queryKey: getGetRoadmapQueryKey({ goal }) } }
  );

  const steps = roadmap?.steps ?? [];
  const totalSteps = steps.length;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tighter uppercase">
          Opportunity Roadmap
        </h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          The exact path seniors wish someone had shown them in Year 1.
        </p>
      </div>

      {/* Goal selector */}
      <div className="flex flex-wrap gap-2">
        {GOALS.map((g) => (
          <button
            key={g.id}
            onClick={() => setGoal(g.id)}
            className={`px-4 py-2 rounded font-mono text-sm border transition-all ${
              goal === g.id
                ? "bg-primary text-black border-primary shadow-[0_0_12px_rgba(0,255,100,0.4)]"
                : "bg-secondary border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      {!isLoading && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span>{roadmap?.goalLabel}</span>
            <span>{totalSteps} MILESTONES</span>
          </div>
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Timeline */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-secondary animate-pulse rounded-md border border-border" />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={goal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />

            <div className="space-y-8">
              {steps.map((step, idx) => {
                const isLeft = idx % 2 === 0;
                const meta = CATEGORY_META[step.category] ?? CATEGORY_META.skill;
                const Icon = meta.icon;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08, type: "spring", stiffness: 120, damping: 18 }}
                    className={`flex items-start gap-6 md:w-[calc(50%-2rem)] ${
                      isLeft ? "md:ml-0 md:mr-auto" : "md:ml-auto md:mr-0"
                    }`}
                  >
                    {/* Node dot */}
                    <div className={`shrink-0 w-10 h-10 rounded-full border-2 border-border flex items-center justify-center ${meta.bg} hidden md:flex absolute ${isLeft ? "right-[-3.25rem]" : "left-[-3.25rem]"}`}>
                      <Icon size={16} className={meta.color} />
                    </div>

                    <div className={`bg-card border border-card-border rounded-md p-5 w-full group hover:border-primary/40 transition-colors relative ${isLeft ? "md:mr-8" : "md:ml-8"}`}>
                      <div className="absolute top-0 left-0 w-1 h-full rounded-l-md" style={{ background: `hsl(var(--primary) / 0.3)` }} />
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-mono text-muted-foreground">{step.month}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs font-mono uppercase ${meta.bg} ${meta.color}`}>
                            {step.category}
                          </Badge>
                          {step.isOptional && (
                            <Badge variant="outline" className="text-xs font-mono uppercase text-muted-foreground">
                              Optional
                            </Badge>
                          )}
                        </div>
                      </div>
                      <h3 className="font-bold font-mono text-sm mb-1 group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">{step.description}</p>

                      <div className="mt-3 flex items-center gap-2">
                        {step.isOptional
                          ? <Circle size={12} className="text-muted-foreground" />
                          : <CheckCircle size={12} className="text-primary" />
                        }
                        <span className="text-xs font-mono text-muted-foreground">
                          {step.isOptional ? "Optional milestone" : "Required milestone"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
