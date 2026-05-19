import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tipsTable = pgTable("tips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  urgency: text("urgency").notNull().default("medium"),
  college: text("college").notNull(),
  branch: text("branch").notNull(),
  authorId: integer("author_id").notNull(),
  status: text("status").notNull().default("pending"),
  verificationCount: integer("verification_count").notNull().default(0),
  deadline: text("deadline"),
  tags: text("tags"),
  credibilityScore: integer("credibility_score").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertTipSchema = createInsertSchema(tipsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTip = z.infer<typeof insertTipSchema>;
export type Tip = typeof tipsTable.$inferSelect;
