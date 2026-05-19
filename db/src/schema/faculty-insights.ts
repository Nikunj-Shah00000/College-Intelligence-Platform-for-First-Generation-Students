import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const facultyInsightsTable = pgTable("faculty_insights", {
  id: serial("id").primaryKey(),
  professorName: text("professor_name").notNull(),
  college: text("college").notNull(),
  branch: text("branch").notNull(),
  department: text("department"),
  insight: text("insight").notNull(),
  insightType: text("insight_type").notNull().default("general"),
  verificationCount: integer("verification_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFacultyInsightSchema = createInsertSchema(facultyInsightsTable).omit({
  id: true,
  createdAt: true,
  verificationCount: true,
});
export type InsertFacultyInsight = z.infer<typeof insertFacultyInsightSchema>;
export type FacultyInsight = typeof facultyInsightsTable.$inferSelect;
