DO $$ BEGIN
 CREATE TYPE "userType" AS ENUM('Customer', 'Admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user_account" ADD COLUMN "userType" "userType" DEFAULT 'Customer' NOT NULL;