import { championship, location, sport, team, teamToChampionships } from '@db/schema';
import { type InferSelectModel } from 'drizzle-orm';

export type SportType = InferSelectModel<typeof sport>;
export type LocationType = InferSelectModel<typeof location>;
export type ChampionshipType = InferSelectModel<typeof championship>;
export type TeamType = InferSelectModel<typeof team>;
type TeamChampionshipType = InferSelectModel<typeof teamToChampionships>;

export type TeamWithChampionshipsType = InferSelectModel<typeof team> & { teamToChampionships: TeamChampionshipType[] };
