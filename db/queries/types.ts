import { championship, eventTeam, location, sport, team, teamToChampionships, ticket, ticketing } from '@db/schema';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
type TeamChampionship = InferSelectModel<typeof teamToChampionships>;

export type Sport = InferSelectModel<typeof sport>;
export type Location = InferSelectModel<typeof location>;
export type Championship = InferSelectModel<typeof championship>;
export type TeamType = InferSelectModel<typeof team>;
export type Ticket = InferSelectModel<typeof ticket>;
export type CreateTicket = InferInsertModel<typeof ticket>;
export type Ticketing = InferSelectModel<typeof ticketing>;
export type TeamWithChampionships = InferSelectModel<typeof team> & { teamToChampionships: TeamChampionship[] };
export type CreateEventTeam = InferInsertModel<typeof eventTeam>;
