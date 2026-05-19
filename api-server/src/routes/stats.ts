import { Router, type IRouter } from "express";
import { eq, count, desc } from "drizzle-orm";
import { db, tipsTable, usersTable, notificationsTable } from "@workspace/db";
import { GetDashboardStatsResponse, GetCategoryBreakdownResponse } from "@workspace/api-zod";
import { serializeDates } from "../lib/serialize";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [totalTipsRow] = await db.select({ count: count() }).from(tipsTable);
  const [verifiedRow] = await db
    .select({ count: count() })
    .from(tipsTable)
    .where(eq(tipsTable.status, "verified"));
  const [pendingRow] = await db
    .select({ count: count() })
    .from(tipsTable)
    .where(eq(tipsTable.status, "pending"));
  const [urgentRow] = await db
    .select({ count: count() })
    .from(tipsTable)
    .where(eq(tipsTable.urgency, "critical"));
  const [totalUsersRow] = await db.select({ count: count() }).from(usersTable);
  const [seniorsRow] = await db
    .select({ count: count() })
    .from(usersTable)
    .where(eq(usersTable.role, "senior"));
  const [totalNotifRow] = await db.select({ count: count() }).from(notificationsTable);

  const recentTips = await db
    .select()
    .from(tipsTable)
    .orderBy(desc(tipsTable.createdAt))
    .limit(5);

  const stats = {
    totalTips: Number(totalTipsRow?.count ?? 0),
    verifiedTips: Number(verifiedRow?.count ?? 0),
    pendingTips: Number(pendingRow?.count ?? 0),
    urgentTips: Number(urgentRow?.count ?? 0),
    totalUsers: Number(totalUsersRow?.count ?? 0),
    seniorContributors: Number(seniorsRow?.count ?? 0),
    totalNotifications: Number(totalNotifRow?.count ?? 0),
    recentTips: serializeDates(recentTips),
  };

  res.json(GetDashboardStatsResponse.parse(stats));
});

router.get("/stats/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select({ category: tipsTable.category, count: count() })
    .from(tipsTable)
    .groupBy(tipsTable.category);

  const result = rows.map((r) => ({ category: r.category, count: Number(r.count) }));
  res.json(GetCategoryBreakdownResponse.parse(result));
});

export default router;
