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

export const eventTeam = pgTable(
	'event_team',
	{
		id: serial('id').primaryKey(),
		championshipId: integer('championship_id')
			.references(() => championship.id)
			.notNull(),
		homeTeamId: integer('home_team_id')
			.references(() => team.id)
			.notNull(),
		awayTeamId: integer('away_team_id')
			.references(() => team.id)
			.notNull(),
		eventDate: timestamp('event_date').notNull(),
		locationId: integer('location_id')
			.references(() => location.id)
			.notNull(),
		sportId: integer('sport_id')
			.references(() => sport.id)
			.notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at'),
	},
	(t) => ({
		unq: unique().on(t.championshipId, t.homeTeamId, t.awayTeamId, t.eventDate),
	})
);

export const evenTeamRelation = relations(eventTeam, ({ many, one }) => ({
	tickets: many(ticket),
	homeTeam: one(team, {
		fields: [eventTeam.homeTeamId],
		references: [team.id],
	}),
	awayTeam: one(team, {
		fields: [eventTeam.awayTeamId],
		references: [team.id],
	}),
}));

export const ticketing = pgTable(
	'ticketing',
	{
		id: serial('id').primaryKey(),
		name: text('name').notNull(),
		iconSvg: text('icon_svg').notNull().default(''),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at'),
	},
	(t) => ({
		unq: unique().on(t.name),
	})
);

export const ticket = pgTable('ticket', {
	id: serial('id').primaryKey(),
	eventId: integer('event_id').notNull(),
	ticketingId: integer('ticketing_id')
		.references(() => ticketing.id)
		.notNull(),
	price: numeric('price').notNull(),
	url: text('url').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at'),
});

export const ticketsRelation = relations(ticket, ({ one }) => ({
	eventTeam: one(eventTeam, {
		fields: [ticket.eventId],
		references: [eventTeam.id],
	}),
}));
