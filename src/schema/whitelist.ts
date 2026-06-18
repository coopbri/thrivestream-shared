import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";

/**
 * Threads sign-in whitelist. While Thrivestream is in private testing only the
 * handles listed here may complete sign-in (see the auth gate); an empty table
 * opens sign-in to any Threads account. Managed from the admin dashboard and
 * seeded once from THREADS_ALLOWED_HANDLES on boot.
 */
export const whitelistHandle = pgTable(
  "whitelist_handle",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Stored already normalised (trimmed, lowercased) by the handlers.
    handle: text("handle").notNull().unique(),
    // Optional note for why/who this handle was invited.
    note: text("note"),
    // Admin who added the handle, kept for auditing. Null for seeded rows.
    addedBy: text("added_by").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("whitelist_handle_created_at_idx").on(t.createdAt)],
);
