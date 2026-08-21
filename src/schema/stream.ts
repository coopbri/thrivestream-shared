import { boolean, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
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
    // Per-stream audience visibility for "ghost streams". Public streams are
    // listed and watchable by anyone; unlisted streams are reachable only by
    // direct link; followers_only streams are limited to the creator's
    // followers (enforced server-side). Public by default so existing streams
    // and pre-toggle clients are unchanged. Validated app-side against
    // STREAM_VISIBILITY (text, not pgEnum, per house style).
    visibility: text("visibility").notNull().default("public"),
    // When the recording should be deleted. The worker reaper removes the stored
    // objects past this instant and nulls the URLs above (Garage has no native
    // lifecycle; R2 would use a bucket rule). Null while unset or while kept; a
    // recording is retained indefinitely when recordingKeep is true (see below).
    recordingExpiresAt: timestamp("recording_expires_at", { withTimezone: true }),
    // Creator "keep" pin. When true, the recording is retained indefinitely: the
    // worker holds recordingExpiresAt null and the retention reaper skips it, so
    // a creator can save a replay past the default retention window. Default off,
    // so recordings follow the normal retention schedule unless explicitly kept.
    recordingKeep: boolean("recording_keep").notNull().default(false),
    // Whether the ABR quality ladder has been resolved for this recording. Set
    // true once the worker has either built the smaller renditions (720p/480p) +
    // master playlist or determined the source is too small for any rung, so the
    // ladder sweep never reprocesses it. Gated behind FLAG_RECORDING_LADDER; when
    // the flag is off this stays false and no ladder work runs.
    recordingLadderReady: boolean("recording_ladder_ready").notNull().default(false),
    // Set when the worker has fired the pre-start reminder push for this
    // scheduled stream, so the T-30 sweep never double-sends. Null until then and
    // for streams that never had a future scheduled_for.
    reminderSentAt: timestamp("reminder_sent_at", { withTimezone: true }),
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

export const STREAM_VISIBILITY = ["public", "unlisted", "followers_only"] as const;
export type StreamVisibility = (typeof STREAM_VISIBILITY)[number];
