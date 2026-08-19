import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";

/**
 * Origin Streamer intake applications. A signed-in Omni account applies once; an
 * admin approves (stamping user.is_origin_streamer) or rejects with a note. Kept
 * out of GraphQL entirely (see originApplicationHardeningPlugin): reads and
 * writes go through admin-gated REST, so an applicant's pitch and contact links
 * never leak, and nobody can self-approve.
 */
export const originApplication = pgTable(
  "origin_application",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // Applicant-entered creator name (defaults to their Omni handle client-side)
    displayName: text("display_name").notNull(),
    // Freeform: what they stream and why they want in
    pitch: text("pitch").notNull(),
    // Newline or space separated URLs (socials, portfolio); optional
    links: text("links"),
    // Freeform audience size or context; optional
    audience: text("audience"),
    // Freeform catch-all ("anything else?") from the applicant; optional
    notes: text("notes"),
    // One of ORIGIN_APPLICATION_STATUS, validated app-side (text, not pgEnum)
    status: text("status").notNull().default("pending"),
    reviewerNote: text("reviewer_note"),
    reviewedBy: text("reviewed_by").references(() => user.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index("origin_application_user_id_idx").on(t.userId),
    index("origin_application_status_idx").on(t.status),
  ],
);

export const ORIGIN_APPLICATION_STATUS = ["pending", "approved", "rejected"] as const;
export type OriginApplicationStatus = (typeof ORIGIN_APPLICATION_STATUS)[number];
