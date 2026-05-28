import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stream } from "./stream";
import { user } from "./user";

export const streamGuest = pgTable(
  "stream_guest",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    streamId: uuid("stream_id")
      .notNull()
      .references(() => stream.id),
    userId: text("user_id").references(() => user.id),
    threadsReplierId: text("threads_replier_id"),
    state: text("state").notNull(),
    invitedAt: timestamp("invited_at", { withTimezone: true }).notNull().defaultNow(),
    onStageAt: timestamp("on_stage_at", { withTimezone: true }),
  },
  (t) => [index("stream_guest_stream_id_state_idx").on(t.streamId, t.state)],
);

export const STREAM_GUEST_STATE = ["invited", "on_stage", "removed"] as const;
export type StreamGuestState = (typeof STREAM_GUEST_STATE)[number];
