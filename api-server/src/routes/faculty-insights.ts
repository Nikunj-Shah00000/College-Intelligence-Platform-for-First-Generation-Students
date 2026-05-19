import { Router, type IRouter } from "express";
import { eq, and, desc, sql } from "drizzle-orm";
import { db, facultyInsightsTable } from "@workspace/db";
import {
  ListFacultyInsightsQueryParams,
  ListFacultyInsightsResponse,
  CreateFacultyInsightBody,
  VerifyFacultyInsightParams,
  VerifyFacultyInsightResponse,
} from "@workspace/api-zod";
import { serializeDates } from "../lib/serialize";

const router: IRouter = Router();

router.get("/faculty-insights", async (req, res): Promise<void> => {
  const query = ListFacultyInsightsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const { college, branch, professorName } = query.data;
  const conditions = [];
  if (college) conditions.push(eq(facultyInsightsTable.college, college));
  if (branch) conditions.push(eq(facultyInsightsTable.branch, branch));
  if (professorName) conditions.push(eq(facultyInsightsTable.professorName, professorName));

  const rows = await db
    .select()
    .from(facultyInsightsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(facultyInsightsTable.verificationCount));

  res.json(ListFacultyInsightsResponse.parse(serializeDates(rows)));
});

router.post("/faculty-insights", async (req, res): Promise<void> => {
  const parsed = CreateFacultyInsightBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(facultyInsightsTable).values(parsed.data).returning();
  res.status(201).json(serializeDates(row));
});

router.post("/faculty-insights/:id/verify", async (req, res): Promise<void> => {
  const params = VerifyFacultyInsightParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .update(facultyInsightsTable)
    .set({ verificationCount: sql`${facultyInsightsTable.verificationCount} + 1` })
    .where(eq(facultyInsightsTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Faculty insight not found" });
    return;
  }
  res.json(VerifyFacultyInsightResponse.parse(serializeDates(row)));
});

export default router;
