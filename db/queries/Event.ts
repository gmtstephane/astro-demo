import { db } from '@db/config';
import { eventTeam, eventType, eventPlayer } from '@db/schema';
import type { Event } from '@db/types';
import { eq } from 'drizzle-orm';

export async function GetEvent(id: string): Promise<Event | undefined> {
	const type = await db.query.eventType.findFirst({ where: eq(eventType.eventid, id) });
	if (!type) return undefined;

	switch (type.type) {
		case 'Team':
			return await db.query.eventTeam.findFirst({ where: eq(eventTeam.id, id) });
		case 'Individual':
			return await db.query.eventPlayer.findFirst({ where: eq(eventPlayer.id, id) });
		case 'Event':
			return await db.query.eventGeneric.findFirst({ where: eq(eventPlayer.id, id) });
		default:
			return undefined;
	}
}
