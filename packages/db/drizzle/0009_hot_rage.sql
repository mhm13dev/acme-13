ALTER TABLE "sessions" ADD COLUMN "previous_refresh_token" varchar(255);--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "previous_used_at" timestamp;