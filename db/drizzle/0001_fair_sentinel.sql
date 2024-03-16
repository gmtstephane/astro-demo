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
ALTER TABLE "location" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "sport" ADD PRIMARY KEY ("id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "championship" ADD CONSTRAINT "championship_sport_id_sport_id_fk" FOREIGN KEY ("sport_id") REFERENCES "sport"("id") ON DELETE no action ON UPDATE no action;
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
