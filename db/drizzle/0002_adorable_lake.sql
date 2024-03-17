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
