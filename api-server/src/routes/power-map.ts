import { Router, type IRouter } from "express";
import { GetPowerMapQueryParams, GetPowerMapResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const powerMaps: Record<string, { nodes: object[]; edges: object[] }> = {
  GGSIPU: {
    nodes: [
      { id: "ieee", label: "IEEE Student Branch", type: "club", value: 85, college: "GGSIPU", description: "Gateway to research labs and global networking. 78% of GGSIPU's international internships go through IEEE members.", placementRate: 78 },
      { id: "csi", label: "CSI Chapter", type: "club", value: 65, college: "GGSIPU", description: "Organized ICPC and hackathons. Strong alumni network in product companies.", placementRate: 65 },
      { id: "google", label: "Google / FAANG", type: "company", value: 90, college: "GGSIPU", description: "Recruits 8-12 students per year. Almost exclusively through referrals from IEEE/coding club alumni.", placementRate: null },
      { id: "anand", label: "Prof. Anand (CS)", type: "professor", value: 55, college: "GGSIPU", description: "Places students in top research labs. Only recommends from his Tuesday optional sessions.", placementRate: null },
      { id: "cse_dept", label: "CS Department", type: "pipeline", value: 70, college: "GGSIPU", description: "Central to all CS opportunities. Controls placement eligibility and recommendation letters.", placementRate: null },
      { id: "robotics", label: "Robotics Club", type: "club", value: 60, college: "GGSIPU", description: "Connects students to hardware startups and DRDO. Has alumni in Boston Dynamics, Bosch.", placementRate: 72 },
      { id: "ml_lab", label: "AI/ML Research Lab", type: "lab", value: 50, college: "GGSIPU", description: "Funded research lab with publications. Working here puts you on professor referral lists automatically.", placementRate: null },
      { id: "ipl_startups", label: "Campus Startups Pipeline", type: "pipeline", value: 45, college: "GGSIPU", description: "Alumni who founded startups actively recruit from their college networks. Fast equity + learning.", placementRate: null },
    ],
    edges: [
      { source: "ieee", target: "google", strength: 9, label: "Alumni referrals" },
      { source: "ieee", target: "anand", strength: 7, label: "Collaboration" },
      { source: "csi", target: "google", strength: 6, label: "Campus drive" },
      { source: "anand", target: "ml_lab", strength: 9, label: "Runs the lab" },
      { source: "ml_lab", target: "google", strength: 5, label: "Research to industry" },
      { source: "cse_dept", target: "anand", strength: 8, label: "Faculty" },
      { source: "cse_dept", target: "ieee", strength: 7, label: "Sponsors" },
      { source: "robotics", target: "ipl_startups", strength: 6, label: "Startup pipeline" },
      { source: "csi", target: "cse_dept", strength: 7, label: "Official chapter" },
    ],
  },
  DTU: {
    nodes: [
      { id: "dtu_racing", label: "DTU Racing", type: "club", value: 80, college: "DTU", description: "Formula Student team. Alumni placed in Bosch, Mercedes-Benz, Mahindra Racing. Prestige club.", placementRate: 82 },
      { id: "byld", label: "BYLD (Business Club)", type: "club", value: 70, college: "DTU", description: "Runs case competitions and connects students to consulting firms. McKinsey has hired from BYLD.", placementRate: 68 },
      { id: "enactus", label: "Enactus DTU", type: "club", value: 55, college: "DTU", description: "Social impact club with strong NGO and government connections. Good for non-tech career paths.", placementRate: 58 },
      { id: "dtu_cs", label: "CS Department", type: "pipeline", value: 75, college: "DTU", description: "Strong placement cell. Controls campus recruitment eligibility criteria.", placementRate: null },
      { id: "amazon", label: "Amazon / Microsoft", type: "company", value: 85, college: "DTU", description: "Campus recruitment. Referrals dramatically increase selection odds.", placementRate: null },
      { id: "research_lab", label: "DTU Research Labs", type: "lab", value: 60, college: "DTU", description: "Multiple government-funded labs. Publications from here support MS abroad applications.", placementRate: null },
      { id: "startup_cell", label: "DTU Innovation Cell", type: "pipeline", value: 50, college: "DTU", description: "Atal incubation. Has produced 3 funded startups. Mentors are active investors.", placementRate: null },
    ],
    edges: [
      { source: "dtu_racing", target: "amazon", strength: 5, label: "Alumni network" },
      { source: "byld", target: "amazon", strength: 7, label: "Consulting recruit" },
      { source: "dtu_cs", target: "amazon", strength: 9, label: "Campus placement" },
      { source: "research_lab", target: "dtu_cs", strength: 7, label: "Faculty overlap" },
      { source: "startup_cell", target: "enactus", strength: 5, label: "Shared projects" },
      { source: "dtu_cs", target: "research_lab", strength: 8, label: "Department" },
      { source: "byld", target: "startup_cell", strength: 6, label: "Entrepreneurship" },
    ],
  },
};

router.get("/power-map", async (req, res): Promise<void> => {
  const query = GetPowerMapQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const college = query.data.college ?? "GGSIPU";
  const map = powerMaps[college] ?? powerMaps["GGSIPU"];

  res.json(GetPowerMapResponse.parse(map));
});

export default router;
