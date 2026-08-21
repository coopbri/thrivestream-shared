import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stream } from "./stream";
import { user } from "./user";

// Durable in-app notification. `type` is app-validated against NOTIFICATION_TYPE
// (text, not pgEnum, per house style). `streamId` is the subject stream for
// stream-related types and null otherwise. `readAt` null = unread.
export const notification = pgTable(
  "notification",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    streamId: uuid("stream_id").references(() => stream.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    readAt: timestamp("read_at", { withTimezone: true }),
  },
  (t) => [index("notification_user_id_idx").on(t.userId)],
);

export const NOTIFICATION_TYPE = ["stream_reminder", "stream_live"] as const;
export type NotificationType = (typeof NOTIFICATION_TYPE)[number];
