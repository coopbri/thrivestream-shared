ALTER TABLE "whitelist_handle" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "whitelist_handle" ADD CONSTRAINT "whitelist_handle_email_unique" UNIQUE("email");