import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const follow = pgTable(
  "follow",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => user.id),
    followedId: text("followed_id")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.followerId, t.followedId] })],
);
