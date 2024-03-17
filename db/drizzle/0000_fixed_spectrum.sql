DO $$ BEGIN
 CREATE TYPE "provider" AS ENUM('Google');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "sport_type" AS ENUM('Team', 'Individual', 'Event');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "championship" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sport_id" integer NOT NULL,
	"icon" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "championship_id_name_unique" UNIQUE("id","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_team" (
	"id" serial PRIMARY KEY NOT NULL,
	"championship_id" integer NOT NULL,
	"home_team_id" integer NOT NULL,
	"away_team_id" integer NOT NULL,
	"event_date" timestamp NOT NULL,
	"location_id" integer NOT NULL,
	"sport_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "event_team_championship_id_home_team_id_away_team_id_event_date_unique" UNIQUE("championship_id","home_team_id","away_team_id","event_date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "location" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"country" text NOT NULL,
	"zipcode" integer NOT NULL,
	"latitude" numeric NOT NULL,
	"longitude" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sport" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sport_type" "sport_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "sport_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sport_id" integer NOT NULL,
	"location_id" integer NOT NULL,
	"icon" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "team_name_sport_id_unique" UNIQUE("name","sport_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_to_championships" (
	"team_id" integer NOT NULL,
	"championship_id" integer NOT NULL,
	CONSTRAINT "team_to_championships_team_id_championship_id_pk" PRIMARY KEY("team_id","championship_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ticket" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"ticketing_id" integer NOT NULL,
	"price" numeric NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ticketing" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon_svg" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "ticketing_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_account" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" text NOT NULL,
	"provider" "provider" NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"given_name" text NOT NULL,
	"family_name" text NOT NULL,
	"picture" text NOT NULL,
	"locale" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "user_account_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "championship" ADD CONSTRAINT "championship_sport_id_sport_id_fk" FOREIGN KEY ("sport_id") REFERENCES "sport"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_team" ADD CONSTRAINT "event_team_championship_id_championship_id_fk" FOREIGN KEY ("championship_id") REFERENCES "championship"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_team" ADD CONSTRAINT "event_team_home_team_id_team_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_team" ADD CONSTRAINT "event_team_away_team_id_team_id_fk" FOREIGN KEY ("away_team_id") REFERENCES "team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_team" ADD CONSTRAINT "event_team_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_team" ADD CONSTRAINT "event_team_sport_id_sport_id_fk" FOREIGN KEY ("sport_id") REFERENCES "sport"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team" ADD CONSTRAINT "team_sport_id_sport_id_fk" FOREIGN KEY ("sport_id") REFERENCES "sport"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team" ADD CONSTRAINT "team_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_to_championships" ADD CONSTRAINT "team_to_championships_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_to_championships" ADD CONSTRAINT "team_to_championships_championship_id_championship_id_fk" FOREIGN KEY ("championship_id") REFERENCES "championship"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ticket" ADD CONSTRAINT "ticket_ticketing_id_ticketing_id_fk" FOREIGN KEY ("ticketing_id") REFERENCES "ticketing"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
