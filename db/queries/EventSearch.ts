import { db } from '@db/config';
import { championship, eventGeneric, eventPlayer, eventTeam, eventType, location, player, sport, team } from '@db/schema';
import { and, eq, gte, ilike, sql, or } from 'drizzle-orm';
import { alias, unionAll } from 'drizzle-orm/pg-core';

export type SearchEvent = {
	id: string;
	name: string;
	icon: string;
};

interface SearchEventProps {
	name: string;
}
export async function SearchEvents({ name }: SearchEventProps): Promise<SearchEvent[]> {
	const homeTeam = alias(team, 'hometeam');
	const awayTeam = alias(team, 'awayteam');

	const eventTeamRequest = db
		.select({
			id: eventTeam.id,
			name: sql<string>`concat(${homeTeam.name}, ' vs ', ${awayTeam.name})`.as('event_team_name'),
			icon: homeTeam.icon,
		})
		.from(eventTeam)
		.innerJoin(homeTeam, eq(homeTeam.id, eventTeam.homeTeamId))
		.innerJoin(awayTeam, eq(awayTeam.id, eventTeam.awayTeamId))
		.where(and(or(ilike(homeTeam.name, `%${name}%`), ilike(awayTeam.name, `%${name}%`)), gte(eventTeam.eventDate, new Date())));

	const player1 = alias(player, 'player1');
	const player2 = alias(player, 'player2');

	const eventPlayerRequest = db
		.select({
			id: eventPlayer.id,
			name: sql<string>`concat(${player1.name}, ' vs ', ${player2.name})`.as('event_player_name'),
			icon: championship.icon,
		})
		.from(eventPlayer)
		.innerJoin(player1, eq(player1.id, eventPlayer.player1))
		.innerJoin(player2, eq(player2.id, eventPlayer.player2))
		.innerJoin(championship, eq(championship.id, eventPlayer.championshipId))
		.where(and(or(ilike(player1.name, `%${name}%`), ilike(player2.name, `%${name}%`)), gte(eventPlayer.eventDate, new Date())));

	const eventGenericRequest = db
		.select({
			id: eventGeneric.id,
			name: eventGeneric.name,
			icon: eventGeneric.icon,
		})
		.from(eventGeneric)
		.innerJoin(location, eq(eventGeneric.locationId, location.id))
		.innerJoin(sport, eq(eventGeneric.sportId, sport.id))
		.where(and(ilike(eventGeneric.name, `%${name}%`), gte(eventGeneric.eventDate, new Date())));

	return unionAll(eventTeamRequest, eventGenericRequest, eventPlayerRequest);
}

export type SearchTeam = {
	id: number;
	name: string;
	icon: string;
};

export async function SearchTeams({ name }: SearchEventProps): Promise<SearchTeam[]> {
	const teamRequest = await db
		.select({
			id: team.id,
			name: team.name,
			icon: team.icon,
		})
		.from(team)
		.where(ilike(team.name, `%${name}%`));

	return teamRequest;
}
