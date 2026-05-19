import { Router, type IRouter } from "express";
import { GetSurvivalGuideQueryParams, GetSurvivalGuideResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const guides = [
  {
    id: "ggsipu-cs-exams",
    title: "Surviving CS Exams",
    category: "exams",
    college: "GGSIPU",
    branch: "Computer Science",
    entries: [
      { text: "60-70% of questions repeat from the last 3-year papers. Solve those before reading the textbook.", source: "Arjun Sharma (CS, 2024)", verifiedBy: 34 },
      { text: "Unit 1 always has a compulsory 10-mark theory question. It's always from the introduction chapter.", source: "Rohan Mehta (CS, 2024)", verifiedBy: 28 },
      { text: "Internal viva has 5 standard questions per subject. Any senior can give you the list. Just ask.", source: "Anonymous Senior", verifiedBy: 41 },
      { text: "Check your attendance register every week — errors are common and near-impossible to fix after the semester ends.", source: "Priya Nair (ECE, 2023)", verifiedBy: 19 },
    ],
  },
  {
    id: "ggsipu-cs-electives",
    title: "Which Electives to Choose",
    category: "electives",
    college: "GGSIPU",
    branch: "Computer Science",
    entries: [
      { text: "Machine Learning elective has the highest score distribution — most students get 8+/10. Good for GPA.", source: "Anonymous Senior", verifiedBy: 22 },
      { text: "Avoid Software Project Management if you want to learn something useful. Take Distributed Systems instead.", source: "Arjun Sharma (CS, 2024)", verifiedBy: 15 },
      { text: "Electives with practical components always have better results than theory-only ones. Pick accordingly.", source: "Anonymous Senior", verifiedBy: 18 },
    ],
  },
  {
    id: "ggsipu-cs-professors",
    title: "Professor Intelligence",
    category: "professors",
    college: "GGSIPU",
    branch: "Computer Science",
    entries: [
      { text: "Prof. Anand: Attend his optional Tuesday sessions. He gives research recommendations only to regulars there.", source: "Arjun Sharma (CS, 2024)", verifiedBy: 18 },
      { text: "Prof. Gupta marks attendance randomly and doesn't always update the register. Counter-verify directly.", source: "Anonymous Senior", verifiedBy: 12 },
      { text: "Most professors respond faster on LinkedIn than email. Use your institutional email for first contact.", source: "Rohan Mehta (CS, 2024)", verifiedBy: 9 },
      { text: "Come to LOR meetings with a draft already written. Professors rarely write from scratch.", source: "Anonymous Senior", verifiedBy: 26 },
    ],
  },
  {
    id: "ggsipu-cs-clubs",
    title: "Club Recruitment Secrets",
    category: "clubs",
    college: "GGSIPU",
    branch: "Computer Science",
    entries: [
      { text: "IEEE fills 70% of seats through referrals before applications open. Email a current member directly.", source: "Priya Nair (ECE, 2023)", verifiedBy: 15 },
      { text: "Robotics Club shortlists based on GitHub projects, not interviews. Have at least one live project.", source: "Anonymous Senior", verifiedBy: 11 },
      { text: "Coding club doesn't care about CGPA. They want Codeforces rating. Get to 1200+ before applying.", source: "Arjun Sharma (CS, 2024)", verifiedBy: 20 },
    ],
  },
  {
    id: "ggsipu-cs-placements",
    title: "Placement Survival Guide",
    category: "placements",
    college: "GGSIPU",
    branch: "Computer Science",
    entries: [
      { text: "Google campus recruitment goes through referrals, not the placement cell. Start building alumni connections in Year 2.", source: "Arjun Sharma (CS, 2024)", verifiedBy: 31 },
      { text: "Amazon's hiring window is October — not December as publicly listed. All intern slots fill by Oct 15.", source: "Anonymous Senior", verifiedBy: 7 },
      { text: "The placement committee has insider info on which companies are visiting. Build relationships with committee members.", source: "Rohan Mehta (CS, 2024)", verifiedBy: 14 },
      { text: "GD rounds eliminate 40% of technically strong candidates. Practice Group Discussion separately.", source: "Anonymous Senior", verifiedBy: 22 },
    ],
  },
  {
    id: "ggsipu-cs-first-year",
    title: "First Year Survival",
    category: "first-year",
    college: "GGSIPU",
    branch: "Computer Science",
    entries: [
      { text: "The first two semesters set your CGPA trajectory. A sub-7 CGPA locks you out of many shortlists permanently.", source: "Rohan Mehta (CS, 2024)", verifiedBy: 39 },
      { text: "Join at least one club in the first semester. Clubs are how seniors find you for referrals.", source: "Anonymous Senior", verifiedBy: 29 },
      { text: "Start DSA in the first year, not third year. Students who start early are dramatically more prepared.", source: "Arjun Sharma (CS, 2024)", verifiedBy: 35 },
      { text: "The college jargon nobody explains: PPO = Pre-Placement Offer, LOR = Letter of Recommendation, RA = Research Assistant.", source: "Anonymous Senior", verifiedBy: 44 },
    ],
  },
  {
    id: "dtu-cs-exams",
    title: "DTU CS Exam Patterns",
    category: "exams",
    college: "DTU",
    branch: "Computer Science",
    entries: [
      { text: "Previous year papers are more reliable than textbooks. DTU rarely sets questions outside the syllabus.", source: "Aditya Kumar (CS, 2024)", verifiedBy: 27 },
      { text: "Practical exams: examiner usually asks to run code, not explain theory. Have working code ready.", source: "Kavya Reddy (Civil, 2023)", verifiedBy: 13 },
    ],
  },
  {
    id: "dtu-cs-placements",
    title: "DTU Placement Intel",
    category: "placements",
    college: "DTU",
    branch: "Computer Science",
    entries: [
      { text: "DTU library has full IEEE Xplore + Springer access through VPN. Most students waste money buying papers.", source: "Aditya Kumar (CS, 2024)", verifiedBy: 9 },
      { text: "BYLD (business club) alumni are in every major consulting firm. Being in BYLD is a direct pipeline.", source: "Anonymous Senior", verifiedBy: 17 },
    ],
  },
];

router.get("/survival-guide", async (req, res): Promise<void> => {
  const query = GetSurvivalGuideQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const { college, branch } = query.data;

  let filtered = guides;
  if (college) filtered = filtered.filter((g) => g.college === college);
  if (branch) filtered = filtered.filter((g) => g.branch === branch);

  res.json(GetSurvivalGuideResponse.parse(filtered));
});

export default router;
