CREATE TABLE IF NOT EXISTS "country" (
	"country_code" varchar(2) PRIMARY KEY NOT NULL,
	"icon" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
