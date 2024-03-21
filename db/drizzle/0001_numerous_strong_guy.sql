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
