ALTER TABLE "sessions" ALTER COLUMN "refresh_token" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "previous_refresh_token" SET DATA TYPE varchar(1000);