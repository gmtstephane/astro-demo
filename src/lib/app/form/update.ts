import { db } from '@db/config';
import { eventType, ticket } from '@db/schema';
import { eq } from 'drizzle-orm';
import { UpdateEventGeneric } from './eventGeneric';
import type { CreateTicket, dbTx } from '@db/types';
import { UpdateEventTeam } from './eventTeam';
import { UpdateEventPlayer } from './eventPlayer';

export async function UpdateEvent(data: FormData, id: string) {
	const eType = await db.query.eventType.findFirst({ where: eq(eventType.eventid, id) });
	if (!eType) return new Response('Failed to update event', { status: 500 });
	switch (eType.type) {
		case 'Team':
			return await UpdateEventTeam(data, id);
		case 'Individual':
			return await UpdateEventPlayer(data, id);
		case 'Event':
			return await UpdateEventGeneric(data, id);
		default:
			return new Response('Failed to update event', { status: 500 });
	}
}

export async function UpdateTickets(
	tickets: CreateTicket[],
	id: string,
	options?: {
		withTx?: dbTx;
	}
) {
	const dialector = options?.withTx || db;

	const newMinPrice = tickets.length > 0 ? tickets.reduce((acc, t) => (t.price < acc ? t.price : acc), Infinity) : null;

	const actualtickets = await dialector.query.ticket.findMany({ where: eq(ticket.eventId, id) });

	//build ticket list that are not in the actual tickets
	const tobeDeleted = actualtickets.filter((t) => !tickets.some((t2) => t2.id === t.id));
	//delete tickets that are not in the new list
	tobeDeleted.map(async (t) => {
		await dialector.delete(ticket).where(eq(ticket.id, t.id));
	});

	const previousMinPrice =
		actualtickets.length > 0 ? actualtickets.reduce((acc, t) => (t.price < acc ? t.price : acc), Infinity) : null;

	tickets.map(async (t) => {
		if (t.id) {
			await dialector
				.update(ticket)
				.set({
					price: t.price,
					eventId: id,
					ticketingId: t.ticketingId,
					url: t.url,
				})
				.where(eq(ticket.id, t.id));
			return;
		} else {
			await dialector.insert(ticket).values({
				price: t.price,
				eventId: id,
				ticketingId: t.ticketingId,
				url: t.url,
			});
		}
	});

	if (previousMinPrice === null && newMinPrice !== null) return NotifyTicketingOpen();
	if (previousMinPrice !== null && newMinPrice !== null && newMinPrice < previousMinPrice) return await NotifyUpdatePrice();
}

export async function NotifyTicketingOpen() {
	console.log('Notifying ticketing open');
}
export async function NotifyUpdatePrice() {
	console.log('Notifying update price');
}
