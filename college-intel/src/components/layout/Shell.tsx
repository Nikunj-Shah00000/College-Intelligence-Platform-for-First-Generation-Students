import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Bell, Home, PlusCircle, BarChart3, User, Map, Network, BookOpen, MessageSquare, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const primaryNav = [
    { href: "/", icon: Home, label: "Intel Feed" },
    { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/submit", icon: PlusCircle, label: "Submit Intel" },
    { href: "/notifications", icon: Bell, label: "Alerts" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  const extendedNav = [
    { href: "/roadmap", icon: Map, label: "Roadmap" },
    { href: "/power-map", icon: Network, label: "Power Map" },
    { href: "/survival-guide", icon: BookOpen, label: "Survival Guide" },
    { href: "/confessions", icon: MessageSquare, label: "Confessions" },
    { href: "/faculty-insights", icon: GraduationCap, label: "Faculty Intel" },
  ];

  const allNav = [...primaryNav, ...extendedNav];

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <div
          className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all cursor-pointer font-mono text-sm ${
            isActive
              ? "bg-primary text-primary-foreground font-bold shadow-[0_0_10px_rgba(0,255,100,0.3)]"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <Icon size={16} />
          {label}
        </div>
      </Link>
    );
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* Sidebar */}
      <aside className="w-56 border-r border-border bg-card flex flex-col hidden md:flex shrink-0">
        <div className="p-5 border-b border-border">
          <Link href="/">
            <h1 className="text-lg font-bold font-mono tracking-tighter cursor-pointer hover:text-primary transition-colors flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-primary rounded-full pulsing-glow" />
              COLLEGE_INTEL
            </h1>
          </Link>
          <p className="text-xs text-muted-foreground mt-1 font-mono uppercase">Hidden curriculum</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {primaryNav.map((item) => <NavItem key={item.href} {...item} />)}

          <div className="pt-3 pb-1 px-4">
            <div className="h-px bg-border" />
            <p className="text-xs font-mono text-muted-foreground/50 uppercase mt-2 tracking-wider">Deep Intel</p>
          </div>

          {extendedNav.map((item) => <NavItem key={item.href} {...item} />)}
        </nav>

        <div className="p-3 border-t border-border text-xs font-mono text-muted-foreground">
          SECURE CHANNEL 0.2.0
        </div>
      </aside>

      {/* Mobile nav bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card z-50 flex justify-around p-2 overflow-x-auto">
        {allNav.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`p-2 rounded-full flex flex-col items-center gap-0.5 ${location === item.href ? "text-primary" : "text-muted-foreground"}`}>
              <item.icon size={20} />
            </div>
          </Link>
        ))}
      </div>

      <main className="flex-1 overflow-hidden relative">
        {/* CRT Scanline overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20"></div>
        <div className="h-full overflow-y-auto pb-20 md:pb-0">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4 md:p-8 max-w-5xl mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
