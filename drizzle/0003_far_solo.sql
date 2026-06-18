CREATE TABLE "whitelist_handle" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"handle" text NOT NULL,
	"note" text,
	"added_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "whitelist_handle_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
ALTER TABLE "whitelist_handle" ADD CONSTRAINT "whitelist_handle_added_by_user_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "whitelist_handle_created_at_idx" ON "whitelist_handle" USING btree ("created_at");