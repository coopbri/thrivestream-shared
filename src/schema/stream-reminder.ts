import { pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stream } from "./stream";
import { user } from "./user";

// A viewer's opt-in to be reminded before a scheduled stream starts. One row per
// (stream, user). Removed when the stream ends or is canceled (worker cleanup),
// or when the viewer toggles the reminder off.
export const streamReminder = pgTable(
  "stream_reminder",
  {
    streamId: uuid("stream_id")
      .notNull()
      .references(() => stream.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.streamId, t.userId] })],
);
