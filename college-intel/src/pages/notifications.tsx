import { useListNotifications, useMarkNotificationRead, getListNotificationsQueryKey } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

export default function Notifications() {
  const { data: notifications, isLoading } = useListNotifications({ unread: false }, {
    query: { queryKey: getListNotificationsQueryKey({ unread: false }) }
  });
  
  const markRead = useMarkNotificationRead();
  const queryClient = useQueryClient();

  const handleMarkRead = (id: number) => {
    markRead.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey({ unread: false }) });
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-6">
        <div className="relative">
          <Bell size={28} className="text-foreground" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full pulsing-glow" />
        </div>
        <h1 className="text-2xl font-bold font-mono tracking-tight">ALERTS</h1>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-secondary animate-pulse rounded-md" />)}
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {notifications?.map((notif, idx) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex items-start gap-4 p-4 rounded-md border ${
                  notif.isRead 
                    ? "bg-card/50 border-transparent opacity-60" 
                    : "bg-card border-card-border border-l-2 border-l-primary"
                }`}
              >
                <div className="mt-1">
                  {notif.urgency === 'critical' ? (
                    <Zap className="text-destructive" size={20} />
                  ) : (
                    <Bell className="text-muted-foreground" size={20} />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-mono text-sm ${notif.isRead ? 'text-muted-foreground' : 'font-bold'}`}>
                    {notif.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 font-sans">{notif.message}</p>
                  <div className="text-xs text-muted-foreground font-mono mt-2 flex gap-3">
                    <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                    <span>{notif.college} - {notif.branch}</span>
                  </div>
                </div>

                {!notif.isRead && (
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {notif.tipId && (
                      <Link href={`/tip/${notif.tipId}`}>
                        <Button size="sm" variant="outline" className="font-mono text-xs h-8">VIEW</Button>
                      </Link>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="font-mono text-xs h-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleMarkRead(notif.id)}
                      disabled={markRead.isPending}
                    >
                      <Check className="mr-1 h-3 w-3" /> MARK READ
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
            
            {notifications?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground font-mono">
                <Bell className="mx-auto mb-4 opacity-20" size={48} />
                NO NEW ALERTS
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
