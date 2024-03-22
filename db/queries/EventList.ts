import { db } from '@db/config';
import { championship, eventGeneric, eventPlayer, eventTeam, eventType, location, player, sport, team, ticket } from '@db/schema';
import type { EventDescription } from '@db/types';
import { eq, gt, gte, sql } from 'drizzle-orm';
import { alias, unionAll } from 'drizzle-orm/pg-core';

export async function GetEventUnion(): Promise<EventDescription[]> {
	const homeTeam = alias(team, 'hometeam');
	const awayTeam = alias(team, 'awayteam');

	const lowerPriceTicket = db.$with('lowestPriceTicket').as(
		db
			.select({
				event_id: ticket.eventId,
				lowest_price: sql<number>`min(${ticket.price})`.as('lowest_price'),
			})
			.from(ticket)
			.groupBy(ticket.eventId)
	);

	const eventTeamRequest = db
		.with(lowerPriceTicket)
		.select({
			id: eventTeam.id,
			name: sql<string>`concat(${homeTeam.name}, ' vs ', ${awayTeam.name})`.as('event_team_name'),
			championship: championship.name,
			icon: homeTeam.icon,
			location: location.name,
			sport: sport.name,
			type: eventType.type,
			min_price: lowerPriceTicket.lowest_price,
			date: eventTeam.eventDate,
		})
		.from(eventTeam)
		.innerJoin(location, eq(eventTeam.locationId, location.id))
		.innerJoin(sport, eq(eventTeam.sportId, sport.id))
		.innerJoin(eventType, eq(eventTeam.id, eventType.eventid))
		.innerJoin(homeTeam, eq(homeTeam.id, eventTeam.homeTeamId))
		.innerJoin(championship, eq(championship.id, eventTeam.championshipId))
		.innerJoin(awayTeam, eq(awayTeam.id, eventTeam.awayTeamId))
		.leftJoin(lowerPriceTicket, eq(eventTeam.id, lowerPriceTicket.event_id))
		.where(gte(eventTeam.eventDate, new Date()));

	const player1 = alias(player, 'player1');
	const player2 = alias(player, 'player2');

	const eventPlayerRequest = db
		.with(lowerPriceTicket)
		.select({
			id: eventPlayer.id,
			name: sql<string>`concat(${player1.name}, ' vs ', ${player2.name})`.as('event_player_name'),
			championship: championship.name,
			icon: championship.icon,
			location: location.name,
			sport: sport.name,
			type: eventType.type,
			min_price: lowerPriceTicket.lowest_price,
			date: eventPlayer.eventDate,
		})
		.from(eventPlayer)
		.innerJoin(location, eq(eventPlayer.locationId, location.id))
		.innerJoin(sport, eq(eventPlayer.sportId, sport.id))
		.innerJoin(eventType, eq(eventPlayer.id, eventType.eventid))
		.innerJoin(player1, eq(player1.id, eventPlayer.player1))
		.innerJoin(player2, eq(player2.id, eventPlayer.player2))
		.innerJoin(championship, eq(championship.id, eventPlayer.championshipId))
		.leftJoin(lowerPriceTicket, eq(eventPlayer.id, lowerPriceTicket.event_id))
		.where(gte(eventPlayer.eventDate, new Date()));

	const eventGenericRequest = db
		.with(lowerPriceTicket)
		.select({
			id: eventGeneric.id,
			name: eventGeneric.name,
			championship: sql<string>`null`,
			icon: eventGeneric.icon,
			location: location.name,
			sport: sport.name,
			type: eventType.type,
			min_price: lowerPriceTicket.lowest_price,
			date: eventGeneric.eventDate,
		})
		.from(eventGeneric)
		.innerJoin(location, eq(eventGeneric.locationId, location.id))
		.innerJoin(sport, eq(eventGeneric.sportId, sport.id))
		.innerJoin(eventType, eq(eventGeneric.id, eventType.eventid))
		.leftJoin(lowerPriceTicket, eq(eventGeneric.id, lowerPriceTicket.event_id))
		.where(gte(eventGeneric.eventDate, new Date()));

	return unionAll(eventPlayerRequest, eventTeamRequest, eventGenericRequest).orderBy(eventGeneric.eventDate);
}
