import { relations } from 'drizzle-orm';
import { serial, text, timestamp, pgTable, numeric, integer, pgEnum, unique, uuid, doublePrecision } from 'drizzle-orm/pg-core';

export type SportType = 'Team' | 'Individual' | 'Event';
export const SportTypeEnum = pgEnum('sport_type', ['Team', 'Individual', 'Event']);

export const location = pgTable('location', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	address: text('address').notNull(),
	city: text('city').notNull(),
	state: text('state').notNull(),
	country: text('country').notNull(),
	zipcode: integer('zipcode').notNull(),
	latitude: doublePrecision('latitude').notNull(),
	longitude: doublePrecision('longitude').notNull(),
	commonSports: integer('sports').array(),
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
		name: text('name').notNull().unique(),
		sportId: integer('sport_id')
			.references(() => sport.id)
			.notNull(),
		icon: text('icon').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at'),
	},
	(t) => ({
		unq: unique().on(t.id, t.name),
	})
);

export const team = pgTable(
	'team',
	{
		id: serial('id').primaryKey(),
		name: text('name').notNull().unique(),
		sportId: integer('sport_id')
			.references(() => sport.id)
			.notNull(),
		locationId: integer('location_id')
			.references(() => location.id)
			.notNull(),
		icon: text('icon').notNull(),
		championships: integer('championships').array().notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at'),
	},
	(t) => ({
		unq: unique().on(t.name, t.sportId),
	})
);

export const player = pgTable(
	'player',
	{
		id: serial('id').primaryKey(),
		sportId: integer('sport_id'),
		name: text('name').notNull().unique(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at'),
	},
	(t) => ({
		unq: unique().on(t.sportId, t.name),
	})
);

export const eventPlayer = pgTable(
	'event_player',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		championshipId: integer('championship_id')
			.references(() => championship.id)
			.notNull(),
		player1: integer('player1_id')
			.references(() => player.id)
			.notNull(),
		player2: integer('player2_id')
			.references(() => player.id)
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
		unq: unique().on(t.championshipId, t.sportId, t.player1, t.player2, t.eventDate),
	})
);

export const eventPlayerRelation = relations(eventPlayer, ({ many, one }) => ({
	tickets: many(ticket),
	player1: one(player, {
		fields: [eventPlayer.player1],
		references: [player.id],
	}),
	player2: one(player, {
		fields: [eventPlayer.player2],
		references: [player.id],
	}),
	location: one(location, {
		fields: [eventPlayer.locationId],
		references: [location.id],
	}),
	sport: one(sport, {
		fields: [eventPlayer.sportId],
		references: [sport.id],
	}),
	championship: one(championship, {
		fields: [eventPlayer.championshipId],
		references: [championship.id],
	}),
}));

export const eventGeneric = pgTable(
	'event_generic',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		name: text('name').notNull(),
		icon: text('icon').notNull(),
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
		unq: unique().on(t.name, t.sportId, t.eventDate),
	})
);

export const eventGenericRelation = relations(eventGeneric, ({ many, one }) => ({
	tickets: many(ticket),
	location: one(location, {
		fields: [eventGeneric.locationId],
		references: [location.id],
	}),
	sport: one(sport, {
		fields: [eventGeneric.sportId],
		references: [sport.id],
	}),
}));

export const eventTeam = pgTable(
	'event_team',
	{
		id: uuid('id').primaryKey().defaultRandom(),
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
	location: one(location, {
		fields: [eventTeam.locationId],
		references: [location.id],
	}),
	sport: one(sport, {
		fields: [eventTeam.sportId],
		references: [sport.id],
	}),
	championship: one(championship, {
		fields: [eventTeam.championshipId],
		references: [championship.id],
	}),
	awayTeam: one(team, {
		fields: [eventTeam.awayTeamId],
		references: [team.id],
	}),
}));

export const ticketing = pgTable('ticketing', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	icon: text('icon').notNull().default(''),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at'),
});

export const eventType = pgTable('event_type', {
	eventid: uuid('id').primaryKey().notNull(),
	type: SportTypeEnum('sport_type').notNull(),
});

export const ticket = pgTable('event_ticket', {
	id: serial('id').primaryKey(),
	eventId: uuid('event_id').notNull(),
	ticketingId: integer('ticketing_id')
		.references(() => ticketing.id)
		.notNull(),
	price: doublePrecision('price').notNull(),
	url: text('url').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at'),
});

export const ticketsRelation = relations(ticket, ({ one }) => ({
	ticketing: one(ticketing, {
		fields: [ticket.ticketingId],
		references: [ticketing.id],
	}),
	eventTeam: one(eventTeam, {
		fields: [ticket.eventId],
		references: [eventTeam.id],
	}),
	eventPlayer: one(eventPlayer, {
		fields: [ticket.eventId],
		references: [eventPlayer.id],
	}),
	eventGeneric: one(eventGeneric, {
		fields: [ticket.eventId],
		references: [eventGeneric.id],
	}),
}));

export const ProviderEnum = pgEnum('provider', ['Google']);
export const UserTypeEnum = pgEnum('userType', ['Customer', 'Admin']);

export const user = pgTable(
	'user_account',
	{
		id: serial('id').primaryKey(),
		providerId: text('provider_id').notNull(),
		provider: ProviderEnum('provider').notNull(),
		userType: UserTypeEnum('userType').notNull().default('Customer'),
		email: text('email').notNull().unique(),
		name: text('name').notNull(),
		givenName: text('given_name').notNull(),
		familyName: text('family_name').notNull(),
		picture: text('picture').notNull(),
		locale: text('locale').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at'),
	},
	(t) => ({
		unq: unique().on(t.providerId, t.provider),
	})
);
