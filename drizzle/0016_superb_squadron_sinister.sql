CREATE TABLE "origin_application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"display_name" text NOT NULL,
	"pitch" text NOT NULL,
	"links" text,
	"audience" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"reviewer_note" text,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_origin_streamer" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "origin_application" ADD CONSTRAINT "origin_application_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "origin_application" ADD CONSTRAINT "origin_application_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "origin_application_user_id_idx" ON "origin_application" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "origin_application_status_idx" ON "origin_application" USING btree ("status");