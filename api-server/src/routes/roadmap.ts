import { Router, type IRouter } from "express";
import { GetRoadmapQueryParams, GetRoadmapResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const roadmaps: Record<
  string,
  { goalLabel: string; steps: { id: number; month: string; title: string; description: string; category: string; isOptional: boolean; tipId: number | null }[] }
> = {
  "google-internship": {
    goalLabel: "Google / FAANG Internship",
    steps: [
      { id: 1, month: "Year 1 — Aug", title: "Master DSA Fundamentals", description: "Commit to Striver's A2Z sheet or NeetCode 150. At least 2 problems/day. Don't skip arrays and strings.", category: "skill", isOptional: false, tipId: null },
      { id: 2, month: "Year 1 — Oct", title: "Join the right coding club", description: "Join CP/Coding clubs at your college — they run mock contests and have alumni in big tech. The referral network starts here.", category: "network", isOptional: false, tipId: null },
      { id: 3, month: "Year 1 — Dec", title: "First public GitHub project", description: "Ship a real project to GitHub with a proper README. Recruiters check GitHub before interviews — this is your earliest proof of work.", category: "skill", isOptional: false, tipId: null },
      { id: 4, month: "Year 2 — Jan", title: "Apply to Google STEP / Microsoft Engage", description: "These programs are designed for Year 1-2 students. Deadline is December–January. Apply the moment applications open.", category: "apply", isOptional: false, tipId: null },
      { id: 5, month: "Year 2 — Mar", title: "Compete in ICPC / Codeforces Div 2", description: "A Codeforces rating above 1400 or ICPC participation signals CS depth. Recruiters from Google India explicitly look for this.", category: "compete", isOptional: true, tipId: null },
      { id: 6, month: "Year 2 — May", title: "Contribute to open source", description: "GSoC, Outreachy, or contributing to a popular repo on GitHub. This is what separates shortlisted from rejected candidates from Tier-2 colleges.", category: "skill", isOptional: true, tipId: null },
      { id: 7, month: "Year 2 — Jul", title: "Build your referral network", description: "Connect with alumni at Google, Meta, Microsoft on LinkedIn. Ask for a referral — they get a bonus for it. Most will say yes to a well-researched ask.", category: "network", isOptional: false, tipId: null },
      { id: 8, month: "Year 3 — Aug", title: "Mock interviews — not just practice", description: "Do 20+ mock interviews on Pramp or with peers before you interview for real. Most rejections are prep failures, not ability failures.", category: "skill", isOptional: false, tipId: null },
      { id: 9, month: "Year 3 — Oct", title: "Apply with referral — not cold portal", description: "Google's hiring window opens in October. Apply through a referral by October 7. Cold portal applications get filtered out at 80% rate.", category: "apply", isOptional: false, tipId: null },
      { id: 10, month: "Year 3 — Dec", title: "Offer & negotiate", description: "If you receive an offer, negotiate. Google has a 15-25% range on stipends for interns. The first number is never the final number.", category: "apply", isOptional: false, tipId: null },
    ],
  },
  "research": {
    goalLabel: "Research Lab / RA Position",
    steps: [
      { id: 1, month: "Year 1 — Sep", title: "Identify target professors early", description: "Find 3-5 professors whose research you actually find interesting. Read one of their papers before reaching out — professors can tell immediately if you haven't.", category: "research", isOptional: false, tipId: null },
      { id: 2, month: "Year 1 — Nov", title: "Cold email with substance", description: "A strong research cold email: 3 lines max, name one specific paper of theirs, mention one concrete skill you have, ask one specific question.", category: "network", isOptional: false, tipId: null },
      { id: 3, month: "Year 1 — Dec", title: "Attend optional sessions & office hours", description: "Show up to optional seminars, journal clubs, and office hours. Physical presence signals seriousness that emails cannot.", category: "network", isOptional: false, tipId: null },
      { id: 4, month: "Year 2 — Jan", title: "Complete a relevant online course", description: "Coursera ML Specialization, Fast.ai, or MIT OCW courses. Certifications are not the goal — demonstrated understanding is.", category: "skill", isOptional: false, tipId: null },
      { id: 5, month: "Year 2 — Mar", title: "Replicate a published paper", description: "Pick a paper from the lab and replicate its results. Share with the professor. This one act has landed more RA positions than any resume.", category: "research", isOptional: false, tipId: null },
      { id: 6, month: "Year 2 — Jun", title: "Apply to SURGE / SRIP / IITB programs", description: "Summer research programs at IITs have Feb-March deadlines. They're competitive but not impossible for motivated students.", category: "apply", isOptional: true, tipId: null },
      { id: 7, month: "Year 3 — Aug", title: "Co-author or assist on a paper", description: "Offer to handle data cleaning, experiments, or literature review. Getting acknowledged in a paper is the gateway to co-authorship.", category: "research", isOptional: false, tipId: null },
    ],
  },
  "startup": {
    goalLabel: "Startup / Entrepreneurship",
    steps: [
      { id: 1, month: "Year 1 — Sep", title: "Ship something real, fast", description: "Build and deploy a tiny product in 2 weeks. Doesn't matter if it fails. Building velocity is the core skill — not the idea.", category: "skill", isOptional: false, tipId: null },
      { id: 2, month: "Year 1 — Nov", title: "Join the college entrepreneurship cell", description: "E-cells run startup pitches, connect you to alumni investors, and give you real feedback. Show up with a problem you're working on.", category: "network", isOptional: false, tipId: null },
      { id: 3, month: "Year 2 — Jan", title: "Enter startup competitions", description: "Smart India Hackathon, Toycathon, E-Summit pitches at IITs. These validate the idea and create momentum.", category: "compete", isOptional: true, tipId: null },
      { id: 4, month: "Year 2 — Mar", title: "Intern at a startup first", description: "Joining a 10-50 person startup gives you experience across all functions that a Google internship won't. Critical context for building your own.", category: "apply", isOptional: false, tipId: null },
      { id: 5, month: "Year 2 — Jul", title: "Find a co-founder", description: "The best co-founders are people you've built something with under pressure. Hackathon teams, open source projects, side-projects first.", category: "network", isOptional: false, tipId: null },
      { id: 6, month: "Year 3 — Aug", title: "Apply to NASSCOM / Atal incubators", description: "Government-backed incubators provide grants, infrastructure, and credibility. Applications are lightweight.", category: "apply", isOptional: true, tipId: null },
      { id: 7, month: "Year 3 — Oct", title: "Build in public", description: "Tweet/post your progress weekly. The Indian startup ecosystem is small — founders, VCs, and journalists follow people building in public.", category: "network", isOptional: false, tipId: null },
    ],
  },
  "placement": {
    goalLabel: "On-Campus Placement",
    steps: [
      { id: 1, month: "Year 1 — Sep", title: "Protect your CGPA early", description: "The first two semesters set your trajectory. A sub-7 CGPA often disqualifies you from shortlists before your resume is read. Bank marks now.", category: "skill", isOptional: false, tipId: null },
      { id: 2, month: "Year 2 — Jan", title: "Start DSA — don't wait for Year 3", description: "Students who start DSA in Year 1-2 are dramatically more prepared than those who cram in Year 3. 6 months of consistent practice beats 1 month of panic.", category: "skill", isOptional: false, tipId: null },
      { id: 3, month: "Year 2 — Jun", title: "Get an internship — any internship", description: "A startup internship counts. A research internship counts. Having zero internship experience by Year 3 is a red flag to most placement recruiters.", category: "apply", isOptional: false, tipId: null },
      { id: 4, month: "Year 3 — Jul", title: "Understand the placement committee dynamics", description: "The placement committee has inside information on which companies are coming. Build relationships with committee members early — this is not optional.", category: "network", isOptional: false, tipId: null },
      { id: 5, month: "Year 3 — Aug", title: "Resume: one page, ATS-optimized", description: "Most resumes get filtered by ATS before a human sees them. Use Jake's Resume template. Keep it one page. Quantify everything.", category: "skill", isOptional: false, tipId: null },
      { id: 6, month: "Year 3 — Sep", title: "Mock GD and HR rounds", description: "Technical rounds get all the prep attention. Group Discussions and HR rounds eliminate 40% of candidates who passed technical. Practice both.", category: "skill", isOptional: false, tipId: null },
      { id: 7, month: "Year 3 — Oct", title: "Placement season begins — be ready Day 1", description: "Dream companies come in the first 2 weeks. If you are not ready by Day 1 of placement season, you have already missed 60% of the opportunity.", category: "apply", isOptional: false, tipId: null },
    ],
  },
};

router.get("/roadmap", async (req, res): Promise<void> => {
  const query = GetRoadmapQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const goal = query.data.goal ?? "google-internship";
  const roadmap = roadmaps[goal] ?? roadmaps["google-internship"];

  const response = {
    goal,
    goalLabel: roadmap.goalLabel,
    steps: roadmap.steps,
  };

  res.json(GetRoadmapResponse.parse(response));
});

export default router;
