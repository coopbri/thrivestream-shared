import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stream } from "./stream";
import { user } from "./user";

export const chatModeration = pgTable(
  "chat_moderation",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    streamId: uuid("stream_id")
      .notNull()
      .references(() => stream.id),
    targetUserId: text("target_user_id")
      .notNull()
      .references(() => user.id),
    kind: text("kind").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (t) => [index("chat_moderation_stream_id_target_user_id_idx").on(t.streamId, t.targetUserId)],
);

export const CHAT_MODERATION_KIND = ["mute", "ban"] as const;
export type ChatModerationKind = (typeof CHAT_MODERATION_KIND)[number];
