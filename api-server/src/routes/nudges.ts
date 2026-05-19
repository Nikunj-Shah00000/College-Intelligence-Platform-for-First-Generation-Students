import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, tipsTable } from "@workspace/db";
import { GetNudgesQueryParams, GetNudgesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/nudges", async (req, res): Promise<void> => {
  const query = GetNudgesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const { college, branch } = query.data;

  const conditions = [];
  if (college) conditions.push(eq(tipsTable.college, college));
  if (branch) conditions.push(eq(tipsTable.branch, branch));

  const urgentTips = await db
    .select()
    .from(tipsTable)
    .where(
      conditions.length > 0
        ? and(eq(tipsTable.urgency, "critical"), ...conditions)
        : eq(tipsTable.urgency, "critical")
    )
    .orderBy(desc(tipsTable.verificationCount))
    .limit(5);

  const highTips = await db
    .select()
    .from(tipsTable)
    .where(
      conditions.length > 0
        ? and(eq(tipsTable.urgency, "high"), ...conditions)
        : eq(tipsTable.urgency, "high")
    )
    .orderBy(desc(tipsTable.verificationCount))
    .limit(3);

  const allTips = [...urgentTips, ...highTips];

  const nudges = allTips.map((tip, idx) => {
    const hoursUntilExpiry = tip.urgency === "critical" ? 24 + idx * 6 : 72 + idx * 12;
    const actionLabel =
      tip.category === "scholarship"
        ? "Apply Now"
        : tip.category === "placement"
          ? "Update Profile"
          : tip.category === "faculty"
            ? "Read Intel"
            : tip.category === "club"
              ? "Check Recruitement"
              : "View Intel";

    const messagePrefix =
      tip.verificationCount > 15
        ? `${tip.verificationCount} students from your branch confirmed:`
        : tip.verificationCount > 5
          ? `${tip.verificationCount} peers verified this:`
          : "Newly posted intel:";

    return {
      id: `nudge-${tip.id}`,
      message: `${messagePrefix} ${tip.title}`,
      urgency: tip.urgency === "critical" ? "critical" : tip.urgency === "high" ? "high" : "medium",
      actionLabel,
      actionType: tip.category,
      tipId: tip.id,
      expiresInHours: hoursUntilExpiry,
    };
  });

  res.json(GetNudgesResponse.parse(nudges));
});

export default router;
