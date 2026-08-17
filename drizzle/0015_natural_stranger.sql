ALTER TABLE "stream_guest" ADD COLUMN "media" text DEFAULT 'video' NOT NULL;--> statement-breakpoint
ALTER TABLE "stream_guest" ADD COLUMN "invite_token_hash" text;--> statement-breakpoint
ALTER TABLE "stream_guest" ADD COLUMN "display_name" text;--> statement-breakpoint
ALTER TABLE "stream_guest" ADD COLUMN "left_at" timestamp with time zone;