import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
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
    threadsPostUrl: text("threads_post_url"),
    livekitRoom: text("livekit_room").notNull(),
    // Video orientation, chosen at go-live (defaulting from the broadcaster's
    // device). Drives the egress capture dimensions (landscape 16:9 vs portrait
    // 9:16) and the viewer player aspect. Landscape by default so existing
    // streams and pre-toggle clients are unchanged. Validated app-side against
    // STREAM_ORIENTATION (text, not pgEnum, per house style).
    orientation: text("orientation").notNull().default("landscape"),
    // Per-stream recording opt-in (default off). When true and FLAG_RECORDING_HLS
    // is on, the worker starts a LiveKit egress job at go-live (see the VOD design
    // doc). Most streams leave this false, so they produce no recording bytes.
    recordEnabled: boolean("record_enabled").notNull().default(false),
    hlsPlaybackUrl: text("hls_playback_url"),
    recordingUrl: text("recording_url"),
    // Whether the finalized recording (replay) is publicly listed. Private by
    // default: a recording finalizes owner-only and the creator explicitly
    // publishes it. Non-owners only see ended streams whose recording is public
    // (enforced server-side in the streamVisibility plugin). Independent of
    // recordingExpiresAt, so the retention reaper still applies either way.
    recordingPublic: boolean("recording_public").notNull().default(false),
    // When the recording should be deleted. The worker reaper removes the stored
    // objects past this instant and nulls the URLs above (Garage has no native
    // lifecycle; R2 would use a bucket rule). Null = kept indefinitely ("Keep").
    recordingExpiresAt: timestamp("recording_expires_at", { withTimezone: true }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    viewerPeak: integer("viewer_peak").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("stream_creator_id_idx").on(t.creatorId)],
);

export const STREAM_STATUS = ["scheduled", "live", "ended", "errored"] as const;
export type StreamStatus = (typeof STREAM_STATUS)[number];

export const STREAM_ORIENTATION = ["landscape", "portrait"] as const;
export type StreamOrientation = (typeof STREAM_ORIENTATION)[number];
