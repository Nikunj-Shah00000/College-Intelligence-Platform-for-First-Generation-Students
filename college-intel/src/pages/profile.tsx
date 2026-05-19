import { useGetUser, getGetUserQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { User as UserIcon, Shield, Award, Calendar, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const userId = 1; // Simulated active user
  const { data: user, isLoading } = useGetUser(userId, {
    query: { enabled: !!userId, queryKey: getGetUserQueryKey(userId) }
  });

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>;
  }

  if (!user) return <div>Profile not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border p-8 rounded-md relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Shield size={200} />
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center border-2 border-primary/20">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <UserIcon size={40} className="text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-mono tracking-tight">{user.name}</h1>
              <Badge variant="outline" className="font-mono bg-primary/10 text-primary border-primary/30 uppercase">
                {user.role}
              </Badge>
            </div>
            <div className="text-sm font-mono text-muted-foreground flex gap-4">
              <span className="flex items-center gap-1"><Award size={14} /> CREDIBILITY: {user.credibilityScore}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> YEAR {user.yearOfStudy || 'N/A'}</span>
            </div>
            <div className="text-sm font-mono text-muted-foreground">
              {user.college} - {user.branch}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card border-card-border h-full">
            <CardHeader>
              <CardTitle className="font-mono text-sm text-muted-foreground uppercase flex items-center gap-2">
                <Activity size={16} /> Operational Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="font-mono text-sm">Intel Submitted</span>
                <span className="font-mono font-bold">14</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="font-mono text-sm">Intel Verified</span>
                <span className="font-mono font-bold">42</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="font-mono text-sm">System Rank</span>
                <span className="font-mono font-bold text-accent">TOP 5%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card border-card-border h-full">
            <CardHeader>
              <CardTitle className="font-mono text-sm text-muted-foreground uppercase flex items-center gap-2">
                <Shield size={16} /> Clearance Levels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span>General Auth</span>
                  <span className="text-primary">GRANTED</span>
                </div>
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span>Critical Intel Broadcast</span>
                  <span className="text-accent">PENDING</span>
                </div>
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[85%]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
