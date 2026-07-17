ALTER TABLE "user" ADD COLUMN "role" text;--> statement-breakpoint
ALTER TABLE "whitelist_handle" ADD COLUMN "threads_user_id" text;--> statement-breakpoint
ALTER TABLE "whitelist_handle" ADD CONSTRAINT "whitelist_handle_threads_user_id_unique" UNIQUE("threads_user_id");