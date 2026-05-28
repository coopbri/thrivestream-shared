import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { chatMessage } from "./chat-message";

export const mirrorJob = pgTable(
  "mirror_job",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    chatMessageId: uuid("chat_message_id")
      .notNull()
      .unique()
      .references(() => chatMessage.id),
    state: text("state").notNull(),
    attempts: integer("attempts").notNull().default(0),
    lastError: text("last_error"),
    runAfter: timestamp("run_after", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("mirror_job_state_run_after_idx").on(t.state, t.runAfter)],
);

export const MIRROR_JOB_STATE = ["pending", "posting", "posted", "failed", "skipped"] as const;
export type MirrorJobState = (typeof MIRROR_JOB_STATE)[number];
