import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Shell } from "@/components/layout/Shell";
import Home from "@/pages/home";
import TipDetail from "@/pages/tip-detail";
import Submit from "@/pages/submit";
import Dashboard from "@/pages/dashboard";
import Notifications from "@/pages/notifications";
import Profile from "@/pages/profile";
import Roadmap from "@/pages/roadmap";
import PowerMap from "@/pages/power-map";
import SurvivalGuide from "@/pages/survival-guide";
import Confessions from "@/pages/confessions";
import FacultyInsights from "@/pages/faculty-insights";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tip/:id" component={TipDetail} />
        <Route path="/submit" component={Submit} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/profile" component={Profile} />
        <Route path="/roadmap" component={Roadmap} />
        <Route path="/power-map" component={PowerMap} />
        <Route path="/survival-guide" component={SurvivalGuide} />
        <Route path="/confessions" component={Confessions} />
        <Route path="/faculty-insights" component={FacultyInsights} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
