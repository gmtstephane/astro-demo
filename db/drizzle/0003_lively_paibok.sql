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
DO $$ BEGIN
 ALTER TABLE "ticket" ADD CONSTRAINT "ticket_ticketing_id_ticketing_id_fk" FOREIGN KEY ("ticketing_id") REFERENCES "ticketing"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
