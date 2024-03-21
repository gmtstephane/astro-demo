import type { CreateTicket } from '@db/types';
import { createEventTeamSchema } from './schemas';
import moment from 'moment-timezone';
import { db } from '@db/config';
import { eventTeam, eventType, ticket } from '@db/schema';
import { eq } from 'drizzle-orm';
import { UpdateTickets } from './update';

export async function CreateEventTeam(data: FormData): Promise<Response> {
	try {
		const tickets: CreateTicket[] = JSON.parse(data.get('tickets')?.toString() || '[]');
		const createEventForm = createEventTeamSchema.parse({
			sport: Number(data.get('sport')),
			location: Number(data.get('location')),
			championship: Number(data.get('championship')),
			homeTeam: Number(data.get('homeTeam')),
			awayTeam: Number(data.get('awayTeam')),
			date: moment.tz(data.get('date')?.toString(), 'Europe/Paris').toDate(),
			tickets: tickets,
		});

		const event = await db.transaction(async (tx) => {
			const event = await tx
				.insert(eventTeam)
				.values({
					awayTeamId: createEventForm.awayTeam,
					championshipId: createEventForm.championship,
					eventDate: createEventForm.date,
					homeTeamId: createEventForm.homeTeam,
					locationId: createEventForm.location,
					sportId: createEventForm.sport,
				})
				.returning();

			if (event.length === 0) {
				tx.rollback();
				throw new Error('Failed to create event');
			}

			await tx.insert(eventType).values({
				eventid: event[0].id,
				type: 'Team',
			});

			tickets.map(async (t) => {
				await tx.insert(ticket).values({
					price: t.price,
					eventId: event[0].id,
					ticketingId: t.ticketingId,
					url: t.url,
				});
			});

			return event[0];
		});

		return new Response(null, { status: 303, headers: { Location: '/events/' + event.id + '?create=true' } });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
}

export async function UpdateEventTeam(data: FormData, id: string) {
	try {
		const tickets: CreateTicket[] = JSON.parse(data.get('tickets')?.toString() || '[]');
		const createEventForm = createEventTeamSchema.parse({
			sport: Number(data.get('sport')),
			location: Number(data.get('location')),
			championship: Number(data.get('championship')),
			homeTeam: Number(data.get('homeTeam')),
			awayTeam: Number(data.get('awayTeam')),
			date: moment.tz(data.get('date')?.toString(), 'Europe/Paris').toDate(),
			tickets: tickets,
		});

		const event = await db.transaction(async (tx) => {
			const event = await tx
				.update(eventTeam)
				.set({
					awayTeamId: createEventForm.awayTeam,
					championshipId: createEventForm.championship,
					eventDate: createEventForm.date,
					homeTeamId: createEventForm.homeTeam,
					locationId: createEventForm.location,
					sportId: createEventForm.sport,
					updatedAt: new Date(),
				})
				.where(eq(eventTeam.id, id))
				.returning();

			if (event.length === 0) {
				throw new Error('Failed to update event');
			}

			await UpdateTickets(tickets, id, { withTx: tx });

			return event[0];
		});

		return new Response(null, { status: 303, headers: { Location: '/events/' + event.id + '?update=true' } });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
}
