import { Router, type IRouter } from "express";
import { eq, and, desc, sql } from "drizzle-orm";
import { db, confessionsTable } from "@workspace/db";
import {
  ListConfessionsQueryParams,
  ListConfessionsResponse,
  CreateConfessionBody,
  UpvoteConfessionParams,
  UpvoteConfessionResponse,
} from "@workspace/api-zod";
import { serializeDates } from "../lib/serialize";

const router: IRouter = Router();

router.get("/confessions", async (req, res): Promise<void> => {
  const query = ListConfessionsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const { college, branch, category } = query.data;
  const conditions = [];
  if (college) conditions.push(eq(confessionsTable.college, college));
  if (branch) conditions.push(eq(confessionsTable.branch, branch));
  if (category) conditions.push(eq(confessionsTable.category, category));

  const rows = await db
    .select()
    .from(confessionsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(confessionsTable.upvoteCount));

  res.json(ListConfessionsResponse.parse(serializeDates(rows)));
});

router.post("/confessions", async (req, res): Promise<void> => {
  const parsed = CreateConfessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(confessionsTable).values(parsed.data).returning();
  res.status(201).json(serializeDates(row));
});

router.post("/confessions/:id/upvote", async (req, res): Promise<void> => {
  const params = UpvoteConfessionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .update(confessionsTable)
    .set({ upvoteCount: sql`${confessionsTable.upvoteCount} + 1` })
    .where(eq(confessionsTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Confession not found" });
    return;
  }
  res.json(UpvoteConfessionResponse.parse(serializeDates(row)));
});

export default router;
