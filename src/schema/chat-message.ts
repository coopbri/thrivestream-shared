import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stream } from "./stream";
import { user } from "./user";

export const chatMessage = pgTable(
  "chat_message",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    streamId: uuid("stream_id")
      .notNull()
      .references(() => stream.id),
    userId: text("user_id").references(() => user.id),
    authorHandle: text("author_handle").notNull(),
    authorAvatarUrl: text("author_avatar_url"),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    mirroredToThreadsReplyId: text("mirrored_to_threads_reply_id"),
  },
  (t) => [index("chat_message_stream_id_created_at_idx").on(t.streamId, t.createdAt)],
);
