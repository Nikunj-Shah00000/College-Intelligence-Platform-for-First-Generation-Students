import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const confessionsTable = pgTable("confessions", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  college: text("college").notNull(),
  branch: text("branch").notNull(),
  category: text("category").notNull().default("general"),
  upvoteCount: integer("upvote_count").notNull().default(0),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertConfessionSchema = createInsertSchema(confessionsTable).omit({
  id: true,
  createdAt: true,
  upvoteCount: true,
  isVerified: true,
});
export type InsertConfession = z.infer<typeof insertConfessionSchema>;
export type Confession = typeof confessionsTable.$inferSelect;
