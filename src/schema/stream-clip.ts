import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stream } from "./stream";
import { user } from "./user";

export const streamClip = pgTable("stream_clip", {
  id: uuid("id").primaryKey().defaultRandom(),
  streamId: uuid("stream_id")
    .notNull()
    .references(() => stream.id),
  creatorId: text("creator_id")
    .notNull()
    .references(() => user.id),
  startOffsetMs: integer("start_offset_ms").notNull(),
  endOffsetMs: integer("end_offset_ms").notNull(),
  storageUrl: text("storage_url").notNull(),
  threadsPostId: text("threads_post_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
