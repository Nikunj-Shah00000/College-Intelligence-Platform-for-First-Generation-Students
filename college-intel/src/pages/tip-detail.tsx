import { useParams } from "wouter";
import { useGetTip, useVerifyTip, getGetTipQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Clock, ShieldCheck, User, Tag, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function TipDetail() {
  const { id } = useParams();
  const tipId = parseInt(id || "0", 10);
  const { data: tip, isLoading } = useGetTip(tipId, {
    query: { enabled: !!tipId, queryKey: getGetTipQueryKey(tipId) },
  });
  
  // Note: Assuming useVerifyTip is available as described
  const verifyTip = useVerifyTip();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleVerify = () => {
    verifyTip.mutate({ id: tipId, data: { verifierId: 1 } }, {
      onSuccess: () => {
        toast({
          title: "Intel Verified",
          description: "Your verification adds credibility to this tip.",
        });
        queryClient.invalidateQueries({ queryKey: getGetTipQueryKey(tipId) });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-1/4 bg-secondary rounded" />
        <div className="h-16 w-3/4 bg-secondary rounded" />
        <div className="h-40 w-full bg-secondary rounded" />
      </div>
    );
  }

  if (!tip) {
    return <div>Tip not found.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <Link href="/">
        <Button variant="ghost" className="pl-0 text-muted-foreground hover:text-foreground font-mono">
          <ArrowLeft className="mr-2 h-4 w-4" />
          BACK TO FEED
        </Button>
      </Link>

      <div className="bg-card border border-card-border p-6 rounded-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-destructive" />
        
        <div className="flex justify-between items-start mb-4 mt-2">
          <div className="flex gap-2">
            <Badge variant="outline" className={`font-mono text-xs uppercase ${tip.urgency === 'critical' ? 'bg-destructive/20 text-destructive border-destructive/30 pulsing-glow' : ''}`}>
              {tip.urgency}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs uppercase bg-secondary">
              {tip.category}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Clock size={14} />
            {new Date(tip.createdAt).toLocaleString()}
          </div>
        </div>

        <h1 className="text-3xl font-bold font-mono tracking-tight mb-6">{tip.title}</h1>
        
        <div className="prose dark:prose-invert max-w-none font-sans text-lg leading-relaxed text-card-foreground/90 mb-8 whitespace-pre-wrap">
          {tip.content}
        </div>

        <div className="flex flex-wrap items-center gap-4 py-4 border-y border-border mb-6 bg-secondary/20 -mx-6 px-6">
          <div className="flex items-center gap-2 text-sm">
            <User size={16} className="text-muted-foreground" />
            <span className="font-mono">{tip.authorName || "Anonymous Senior"}</span>
            <Badge variant="secondary" className="text-[10px] ml-1">CRED: {tip.credibilityScore || 85}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
            <Tag size={16} />
            {tip.college} - {tip.branch}
          </div>
          {tip.deadline && (
            <div className="flex items-center gap-2 text-sm text-accent font-mono ml-auto font-bold bg-accent/10 px-3 py-1 rounded">
              <AlertTriangle size={16} />
              DUE: {new Date(tip.deadline).toLocaleString()}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleVerify} 
                disabled={verifyTip.isPending}
                className="font-mono bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                VERIFY INTEL
              </Button>
            </motion.div>
            <span className="text-sm font-mono text-muted-foreground">
              {tip.verificationCount} others verified this
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
