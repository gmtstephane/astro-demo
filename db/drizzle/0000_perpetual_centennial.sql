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
DO $$ BEGIN
 CREATE TYPE "userType" AS ENUM('Customer', 'Admin');
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
	CONSTRAINT "championship_name_unique" UNIQUE("name"),
	CONSTRAINT "championship_id_name_unique" UNIQUE("id","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_generic" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"icon" text NOT NULL,
	"event_date" timestamp NOT NULL,
	"location_id" integer NOT NULL,
	"sport_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "event_generic_name_sport_id_event_date_unique" UNIQUE("name","sport_id","event_date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_player" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"championship_id" integer NOT NULL,
	"player1_id" integer NOT NULL,
	"player2_id" integer NOT NULL,
	"event_date" timestamp NOT NULL,
	"location_id" integer NOT NULL,
	"sport_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "event_player_championship_id_sport_id_player1_id_player2_id_event_date_unique" UNIQUE("championship_id","sport_id","player1_id","player2_id","event_date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
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
CREATE TABLE IF NOT EXISTS "event_type" (
	"id" uuid PRIMARY KEY NOT NULL,
	"sport_type" "sport_type" NOT NULL
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
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"sports" integer[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player" (
	"id" serial PRIMARY KEY NOT NULL,
	"sport_id" integer,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "player_name_unique" UNIQUE("name"),
	CONSTRAINT "player_sport_id_name_unique" UNIQUE("sport_id","name")
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
	"championships_id" integer[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "team_name_unique" UNIQUE("name"),
	CONSTRAINT "team_name_sport_id_unique" UNIQUE("name","sport_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_ticket" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" uuid NOT NULL,
	"ticketing_id" integer NOT NULL,
	"price" double precision NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ticketing" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "ticketing_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_account" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" text NOT NULL,
	"provider" "provider" NOT NULL,
	"userType" "userType" DEFAULT 'Customer' NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"given_name" text NOT NULL,
	"family_name" text NOT NULL,
	"picture" text NOT NULL,
	"locale" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "user_account_email_unique" UNIQUE("email"),
	CONSTRAINT "user_account_provider_id_provider_unique" UNIQUE("provider_id","provider")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "championship" ADD CONSTRAINT "championship_sport_id_sport_id_fk" FOREIGN KEY ("sport_id") REFERENCES "sport"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_generic" ADD CONSTRAINT "event_generic_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_generic" ADD CONSTRAINT "event_generic_sport_id_sport_id_fk" FOREIGN KEY ("sport_id") REFERENCES "sport"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_player" ADD CONSTRAINT "event_player_championship_id_championship_id_fk" FOREIGN KEY ("championship_id") REFERENCES "championship"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_player" ADD CONSTRAINT "event_player_player1_id_player_id_fk" FOREIGN KEY ("player1_id") REFERENCES "player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_player" ADD CONSTRAINT "event_player_player2_id_player_id_fk" FOREIGN KEY ("player2_id") REFERENCES "player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_player" ADD CONSTRAINT "event_player_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_player" ADD CONSTRAINT "event_player_sport_id_sport_id_fk" FOREIGN KEY ("sport_id") REFERENCES "sport"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "event_ticket" ADD CONSTRAINT "event_ticket_ticketing_id_ticketing_id_fk" FOREIGN KEY ("ticketing_id") REFERENCES "ticketing"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
