import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const threadsIdentity = pgTable("threads_identity", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id),
  threadsUserId: text("threads_user_id").notNull().unique(),
  // The connected Threads @handle, captured so profile "Follow on Threads"
  // links survive the handle becoming the Omni username. Nullable: backfilled in
  // the background on sign-in, so a freshly connected row may not have it yet
  threadsUsername: text("threads_username"),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  scopes: text("scopes").notNull(),
  lastRefreshAt: timestamp("last_refresh_at", { withTimezone: true }),
  // Per-creator opt-in for the go-live Threads announcement. This toggle is the
  // sole gate on whether the announcement posts (off by default)
  autopostEnabled: boolean("autopost_enabled").notNull().default(false),
  // Per-creator opt-in for mirroring live chat into the go-live post. Requires
  // autopostEnabled (no post = nothing to mirror); off by default
  chatMirrorEnabled: boolean("chat_mirror_enabled").notNull().default(false),
});
