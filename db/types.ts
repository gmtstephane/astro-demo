import {
	championship,
	eventGeneric,
	eventPlayer,
	eventTeam,
	location,
	player,
	sport,
	team,
	ticket,
	ticketing,
	user,
} from '@db/schema';
import { type InferSelectModel, type InferInsertModel, type ExtractTablesWithRelations } from 'drizzle-orm';

import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import * as schema from '@db/schema';

export type dbTx = PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;

export type Sport = InferSelectModel<typeof sport>;
export type Location = InferSelectModel<typeof location>;
export type Championship = InferSelectModel<typeof championship>;
export type Team = InferSelectModel<typeof team>;
export type Player = InferSelectModel<typeof player>;

export type Ticket = InferSelectModel<typeof ticket>;
export type CreateTicket = InferInsertModel<typeof ticket>;
export type Ticketing = InferSelectModel<typeof ticketing>;

export type EventTeam = InferSelectModel<typeof eventTeam>;
export type EventPlayer = InferSelectModel<typeof eventPlayer>;
export type EventGeneric = InferSelectModel<typeof eventGeneric>;

export type Event = EventTeam | EventPlayer | EventGeneric;

export type CreateEventTeam = InferInsertModel<typeof eventTeam>;
export type CreateEventPlayer = InferInsertModel<typeof eventPlayer>;
export type CreateEventGeneric = InferInsertModel<typeof eventGeneric>;

export type CreateUser = InferInsertModel<typeof user>;
export type User = InferSelectModel<typeof user>;

export function isEventTeam(event: Event): event is EventTeam {
	return (event as EventTeam).awayTeamId !== undefined && (event as EventTeam).homeTeamId !== undefined;
}

export function isEventPlayer(event: Event): event is EventPlayer {
	return (event as EventPlayer).player1 !== undefined && (event as EventPlayer).player2 !== undefined;
}

export function isEventGeneric(event: Event): event is EventGeneric {
	return isEventPlayer(event) === false && isEventTeam(event) === false;
}
