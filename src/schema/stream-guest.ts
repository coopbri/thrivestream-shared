import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stream } from "./stream";
import { user } from "./user";

export const streamGuest = pgTable(
  "stream_guest",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    streamId: uuid("stream_id")
      .notNull()
      .references(() => stream.id),
    userId: text("user_id").references(() => user.id),
    threadsReplierId: text("threads_replier_id"),
    // invited -> backstage -> on_stage -> removed (see STREAM_GUEST_STATE). A
    // guest publishes into the backstage room while backstage and into the live
    // room only once on_stage, so this column is the sole authority for which
    // token the server will mint
    state: text("state").notNull(),
    // "video" or "audio": whether the guest publishes camera or joins audio-only
    media: text("media").notNull().default("video"),
    // Hash of the signed invite token this row was created for, so a rotated or
    // removed invite can be rejected without storing the token itself
    inviteTokenHash: text("invite_token_hash"),
    // Shown backstage and on the roster before the guest's tracks load
    displayName: text("display_name"),
    invitedAt: timestamp("invited_at", { withTimezone: true }).notNull().defaultNow(),
    onStageAt: timestamp("on_stage_at", { withTimezone: true }),
    leftAt: timestamp("left_at", { withTimezone: true }),
  },
  (t) => [index("stream_guest_stream_id_state_idx").on(t.streamId, t.state)],
);

export const STREAM_GUEST_STATE = ["invited", "backstage", "on_stage", "removed"] as const;
export type StreamGuestState = (typeof STREAM_GUEST_STATE)[number];

export const STREAM_GUEST_MEDIA = ["video", "audio"] as const;
export type StreamGuestMedia = (typeof STREAM_GUEST_MEDIA)[number];
