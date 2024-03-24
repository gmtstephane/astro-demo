import { db } from '@db/config';
import { championship, eventTeam, team } from '@db/schema';
import type { Championship, EventTeam, Location, Sport, Team } from '@db/types';
import { eq, gte, inArray } from 'drizzle-orm';

export type TeamPage = Team & {
	sport: Sport;
	location: Location;
	homeEvents: EventTeam[];
	awayEvents: EventTeam[];
	championships: Championship[];
	// championships: Championship[];
};

export async function GetTeam(id: number): Promise<TeamPage> {
	const t = await db.query.team.findFirst({
		with: {
			location: true,
			awayEvents: {
				where: gte(eventTeam.eventDate, new Date()),
				with: { awayTeam: true, championship: true, homeTeam: true, location: true, sport: true, tickets: true },
				limit: 10,
			},
			homeEvents: {
				where: gte(eventTeam.eventDate, new Date()),
				with: { awayTeam: true, championship: true, homeTeam: true, location: true, sport: true, tickets: true },
				limit: 10,
			},
			sport: true,
		},
		where: eq(team.id, id),
	});

	if (!t) {
		throw new Error('Team not found');
	}

	const ch: Championship[] = await db.query.championship.findMany({
		where: inArray(championship.id, t?.championshipsId),
	});

	const ret: TeamPage = {
		...t,
		championships: ch,
	};

	return ret;
}
