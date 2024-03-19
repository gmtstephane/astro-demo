import { championship, eventTeam, location, sport, team, ticket, ticketing, user } from '@db/schema';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export type Sport = InferSelectModel<typeof sport>;
export type Location = InferSelectModel<typeof location>;
export type Championship = InferSelectModel<typeof championship>;
export type Team = InferSelectModel<typeof team>;
export type Ticket = InferSelectModel<typeof ticket>;
export type CreateTicket = InferInsertModel<typeof ticket>;
export type Ticketing = InferSelectModel<typeof ticketing>;
export type CreateEventTeam = InferInsertModel<typeof eventTeam>;

export type CreateUser = InferInsertModel<typeof user>;
export type User = InferSelectModel<typeof user>;
