import { relations } from 'drizzle-orm';
import { serial, text, timestamp, pgTable, numeric, integer, pgEnum, unique, primaryKey } from 'drizzle-orm/pg-core';

export const SportTypeEnum = pgEnum('sport_type', ['Team', 'Individual', 'Event']);

export const location = pgTable('location', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	address: text('address').notNull(),
	city: text('city').notNull(),
	state: text('state').notNull(),
	country: text('country').notNull(),
	zipcode: integer('zipcode').notNull(),
	latitude: numeric('latitude').notNull(),
	longitude: numeric('longitude').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at'),
});

export const sport = pgTable('sport', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	type: SportTypeEnum('sport_type').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at'),
});

export const championship = pgTable(
	'championship',
	{
		id: serial('id').primaryKey(),
		name: text('name').notNull(),
		sportId: integer('sport_id')
			.references(() => sport.id)
			.notNull(),
		iconSvg: text('icon').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at'),
	},
	(t) => ({
		unq: unique().on(t.id, t.name),
	})
);

export const championshipsRelations = relations(championship, ({ many }) => ({
	teamToChampionships: many(teamToChampionships),
}));

export const team = pgTable(
	'team',
	{
		id: serial('id').primaryKey(),
		name: text('name').notNull(),
		sportId: integer('sport_id')
			.references(() => sport.id)
			.notNull(),
		locationId: integer('location_id')
			.references(() => location.id)
			.notNull(),
		iconSvg: text('icon').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at'),
	},
	(t) => ({
		unq: unique().on(t.name, t.sportId),
	})
);
export const usersRelations = relations(team, ({ many }) => ({
	teamToChampionships: many(teamToChampionships),
}));

export const teamToChampionships = pgTable(
	'team_to_championships',
	{
		teamId: integer('team_id')
			.notNull()
			.references(() => team.id),
		championshipId: integer('championship_id')
			.notNull()
			.references(() => championship.id),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.teamId, t.championshipId] }),
	})
);

export const teamsToChampionshipsRelations = relations(teamToChampionships, ({ one }) => ({
	team: one(team, {
		fields: [teamToChampionships.teamId],
		references: [team.id],
	}),
	championship: one(championship, {
		fields: [teamToChampionships.championshipId],
		references: [championship.id],
	}),
}));
