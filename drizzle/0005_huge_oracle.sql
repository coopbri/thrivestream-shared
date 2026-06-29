ALTER TABLE "stream" ADD COLUMN "record_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "stream" ADD COLUMN "recording_expires_at" timestamp with time zone;