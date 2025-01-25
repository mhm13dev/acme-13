ALTER TABLE "org_users" RENAME TO "org_members";--> statement-breakpoint
ALTER TABLE "org_members" DROP CONSTRAINT "org_users_userId_orgId_unique";--> statement-breakpoint
ALTER TABLE "org_members" DROP CONSTRAINT "org_users_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "org_members" DROP CONSTRAINT "org_users_org_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_userId_orgId_unique" UNIQUE("user_id","org_id");