import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const threadsIdentity = pgTable("threads_identity", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id),
  threadsUserId: text("threads_user_id").notNull().unique(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  scopes: text("scopes").notNull(),
  lastRefreshAt: timestamp("last_refresh_at", { withTimezone: true }),
});
