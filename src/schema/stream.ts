import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";

export const stream = pgTable(
  "stream",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: text("creator_id")
      .notNull()
      .references(() => user.id),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").notNull(),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
    threadsPostId: text("threads_post_id"),
    livekitRoom: text("livekit_room").notNull(),
    hlsPlaybackUrl: text("hls_playback_url"),
    recordingUrl: text("recording_url"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    viewerPeak: integer("viewer_peak").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("stream_creator_id_idx").on(t.creatorId)],
);

export const STREAM_STATUS = ["scheduled", "live", "ended", "errored"] as const;
export type StreamStatus = (typeof STREAM_STATUS)[number];
