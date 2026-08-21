import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

// Pre-accepted Firstwater Streamers who have not signed in yet ("invited but not
// bound"). A roster entry is keyed on a Threads/Omni handle and/or an Omni
// account email; on that person's first sign-in the session hook matches it,
// stamps user.is_origin_streamer, and deletes the row (it has become a real
// broadcaster account). Until then the entry carries the streamer on the public
// count and the admin Streamers view, so the roster survives before signup.
//
// Reinstated 2026-08-21 after the original whitelist_handle table was dropped
// (migration 0019) with no backup, losing the invite list. Held out of GraphQL
// entirely (authTablesHardeningPlugin) so invitee emails never leak.
export const originRoster = pgTable(
  "origin_roster",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Normalized handle (no leading @, lowercased); null for an email-only invite
    handle: text("handle"),
    // Omni account email; null for a handle-only invite
    email: text("email"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // A given handle/email appears at most once. Postgres allows many NULLs under
    // a unique index, so handle-only and email-only invites coexist freely.
    uniqueIndex("origin_roster_handle_key").on(t.handle),
    uniqueIndex("origin_roster_email_key").on(t.email),
  ],
);
