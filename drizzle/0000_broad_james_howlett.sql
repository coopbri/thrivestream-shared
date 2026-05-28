CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"handle" text NOT NULL,
	"display_name" text NOT NULL,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "follow" (
	"follower_id" uuid NOT NULL,
	"followed_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "follow_follower_id_followed_id_pk" PRIMARY KEY("follower_id","followed_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "threads_identity" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"threads_user_id" text NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"expires_at" timestamp with time zone,
	"scopes" text NOT NULL,
	"last_refresh_at" timestamp with time zone,
	CONSTRAINT "threads_identity_threads_user_id_unique" UNIQUE("threads_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stream" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" text NOT NULL,
	"scheduled_for" timestamp with time zone,
	"threads_post_id" text,
	"livekit_room" text NOT NULL,
	"hls_playback_url" text,
	"recording_url" text,
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"viewer_peak" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stream_guest" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stream_id" uuid NOT NULL,
	"user_id" uuid,
	"threads_replier_id" text,
	"state" text NOT NULL,
	"invited_at" timestamp with time zone DEFAULT now() NOT NULL,
	"on_stage_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat_message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stream_id" uuid NOT NULL,
	"user_id" uuid,
	"author_handle" text NOT NULL,
	"author_avatar_url" text,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"mirrored_to_threads_reply_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat_moderation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stream_id" uuid NOT NULL,
	"target_user_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mirror_job" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_message_id" uuid NOT NULL,
	"state" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"run_after" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mirror_job_chat_message_id_unique" UNIQUE("chat_message_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stream_clip" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stream_id" uuid NOT NULL,
	"creator_id" uuid NOT NULL,
	"start_offset_ms" integer NOT NULL,
	"end_offset_ms" integer NOT NULL,
	"storage_url" text NOT NULL,
	"threads_post_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follow" ADD CONSTRAINT "follow_follower_id_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follow" ADD CONSTRAINT "follow_followed_id_user_id_fk" FOREIGN KEY ("followed_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threads_identity" ADD CONSTRAINT "threads_identity_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stream" ADD CONSTRAINT "stream_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stream_guest" ADD CONSTRAINT "stream_guest_stream_id_stream_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."stream"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stream_guest" ADD CONSTRAINT "stream_guest_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_stream_id_stream_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."stream"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_moderation" ADD CONSTRAINT "chat_moderation_stream_id_stream_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."stream"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_moderation" ADD CONSTRAINT "chat_moderation_target_user_id_user_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mirror_job" ADD CONSTRAINT "mirror_job_chat_message_id_chat_message_id_fk" FOREIGN KEY ("chat_message_id") REFERENCES "public"."chat_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stream_clip" ADD CONSTRAINT "stream_clip_stream_id_stream_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."stream"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stream_clip" ADD CONSTRAINT "stream_clip_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stream_creator_id_idx" ON "stream" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stream_guest_stream_id_state_idx" ON "stream_guest" USING btree ("stream_id","state");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_message_stream_id_created_at_idx" ON "chat_message" USING btree ("stream_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_moderation_stream_id_target_user_id_idx" ON "chat_moderation" USING btree ("stream_id","target_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mirror_job_state_run_after_idx" ON "mirror_job" USING btree ("state","run_after");