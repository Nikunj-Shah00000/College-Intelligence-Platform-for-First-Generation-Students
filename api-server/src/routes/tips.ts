import { Router, type IRouter } from "express";
import { eq, desc, and, sql } from "drizzle-orm";
import { db, tipsTable, usersTable } from "@workspace/db";
import {
  ListTipsQueryParams,
  ListTipsResponse,
  CreateTipBody,
  GetTipParams,
  GetTipResponse,
  UpdateTipParams,
  UpdateTipBody,
  UpdateTipResponse,
  DeleteTipParams,
  GetTrendingTipsResponse,
  GetUrgentTipsResponse,
  VerifyTipParams,
  VerifyTipBody,
  UnverifyTipParams,
  UnverifyTipResponse,
} from "@workspace/api-zod";
import { serializeDates } from "../lib/serialize";

const router: IRouter = Router();

async function enrichTipWithAuthor(tip: typeof tipsTable.$inferSelect) {
  const [author] = await db.select().from(usersTable).where(eq(usersTable.id, tip.authorId));
  return serializeDates({ ...tip, authorName: author?.name ?? null });
}

router.get("/tips/trending", async (_req, res): Promise<void> => {
  const tips = await db
    .select()
    .from(tipsTable)
    .orderBy(desc(tipsTable.verificationCount))
    .limit(10);
  const enriched = await Promise.all(tips.map(enrichTipWithAuthor));
  res.json(GetTrendingTipsResponse.parse(enriched));
});

router.get("/tips/urgent", async (_req, res): Promise<void> => {
  const tips = await db
    .select()
    .from(tipsTable)
    .where(eq(tipsTable.urgency, "critical"))
    .orderBy(desc(tipsTable.createdAt))
    .limit(10);
  const enriched = await Promise.all(tips.map(enrichTipWithAuthor));
  res.json(GetUrgentTipsResponse.parse(enriched));
});

router.get("/tips", async (req, res): Promise<void> => {
  const queryParams = ListTipsQueryParams.safeParse(req.query);
  if (!queryParams.success) {
    res.status(400).json({ error: queryParams.error.message });
    return;
  }
  const { college, branch, category, urgency, status } = queryParams.data;

  const conditions = [];
  if (college) conditions.push(eq(tipsTable.college, college));
  if (branch) conditions.push(eq(tipsTable.branch, branch));
  if (category) conditions.push(eq(tipsTable.category, category));
  if (urgency) conditions.push(eq(tipsTable.urgency, urgency));
  if (status) conditions.push(eq(tipsTable.status, status));

  const tips = await db
    .select()
    .from(tipsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(tipsTable.createdAt));

  const enriched = await Promise.all(tips.map(enrichTipWithAuthor));
  res.json(ListTipsResponse.parse(enriched));
});

router.post("/tips", async (req, res): Promise<void> => {
  const parsed = CreateTipBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [tip] = await db.insert(tipsTable).values(parsed.data).returning();
  const enriched = await enrichTipWithAuthor(tip);
  res.status(201).json(GetTipResponse.parse(enriched));
});

router.get("/tips/:id", async (req, res): Promise<void> => {
  const params = GetTipParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [tip] = await db.select().from(tipsTable).where(eq(tipsTable.id, params.data.id));
  if (!tip) {
    res.status(404).json({ error: "Tip not found" });
    return;
  }
  const enriched = await enrichTipWithAuthor(tip);
  res.json(GetTipResponse.parse(enriched));
});

router.patch("/tips/:id", async (req, res): Promise<void> => {
  const params = UpdateTipParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateTipBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [tip] = await db
    .update(tipsTable)
    .set(parsed.data)
    .where(eq(tipsTable.id, params.data.id))
    .returning();
  if (!tip) {
    res.status(404).json({ error: "Tip not found" });
    return;
  }
  const enriched = await enrichTipWithAuthor(tip);
  res.json(UpdateTipResponse.parse(enriched));
});

router.delete("/tips/:id", async (req, res): Promise<void> => {
  const params = DeleteTipParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [tip] = await db
    .delete(tipsTable)
    .where(eq(tipsTable.id, params.data.id))
    .returning();
  if (!tip) {
    res.status(404).json({ error: "Tip not found" });
    return;
  }
  res.sendStatus(204);
});

router.post("/tips/:id/verify", async (req, res): Promise<void> => {
  const params = VerifyTipParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = VerifyTipBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [tip] = await db
    .update(tipsTable)
    .set({
      verificationCount: sql`${tipsTable.verificationCount} + 1`,
      status: "verified",
      credibilityScore: sql`${tipsTable.credibilityScore} + 10`,
    })
    .where(eq(tipsTable.id, params.data.id))
    .returning();
  if (!tip) {
    res.status(404).json({ error: "Tip not found" });
    return;
  }
  const enriched = await enrichTipWithAuthor(tip);
  res.status(201).json(GetTipResponse.parse(enriched));
});

router.delete("/tips/:id/verify", async (req, res): Promise<void> => {
  const params = UnverifyTipParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [tip] = await db
    .update(tipsTable)
    .set({
      verificationCount: sql`GREATEST(${tipsTable.verificationCount} - 1, 0)`,
      credibilityScore: sql`GREATEST(${tipsTable.credibilityScore} - 10, 0)`,
    })
    .where(eq(tipsTable.id, params.data.id))
    .returning();
  if (!tip) {
    res.status(404).json({ error: "Tip not found" });
    return;
  }
  const enriched = await enrichTipWithAuthor(tip);
  res.json(UnverifyTipResponse.parse(enriched));
});

export default router;
