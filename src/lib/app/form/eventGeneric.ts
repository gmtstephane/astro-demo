import type { CreateTicket } from '@db/types';
import moment from 'moment-timezone';
import { db } from '@db/config';

import { ticket, eventType, eventGeneric } from '@db/schema';
import { createEventGenericSchema } from './schemas';
import { eq } from 'drizzle-orm';
import { UpdateTickets } from './update';

export async function CreateEventGeneric(data: FormData): Promise<Response> {
	try {
		const tickets: CreateTicket[] = JSON.parse(data.get('tickets')?.toString() || '[]');
		const createEventForm = createEventGenericSchema.parse({
			sport: Number(data.get('sport')),
			location: Number(data.get('location')),
			name: data.get('name'),
			image: data.get('image'),
			date: moment.tz(data.get('date')?.toString(), 'Europe/Paris').toDate(),
		});

		const event = await db.transaction(async (tx) => {
			const event = await tx
				.insert(eventGeneric)
				.values({
					locationId: createEventForm.location,
					sportId: createEventForm.sport,
					eventDate: createEventForm.date,
					icon: createEventForm.image,
					name: createEventForm.name,
				})
				.returning();

			if (event.length === 0) {
				tx.rollback();
				throw new Error('Failed to create event');
			}

			await tx.insert(eventType).values({
				eventid: event[0].id,
				type: 'Event',
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

export async function UpdateEventGeneric(data: FormData, id: string) {
	try {
		const tickets: CreateTicket[] = JSON.parse(data.get('tickets')?.toString() || '[]');
		const createEventForm = createEventGenericSchema.parse({
			sport: Number(data.get('sport')),
			location: Number(data.get('location')),
			name: data.get('name'),
			image: data.get('image'),
			date: moment.tz(data.get('date')?.toString(), 'Europe/Paris').toDate(),
		});

		const event = await db.transaction(async (tx) => {
			const event = await tx
				.update(eventGeneric)
				.set({
					locationId: createEventForm.location,
					sportId: createEventForm.sport,
					eventDate: createEventForm.date,
					icon: createEventForm.image,
					name: createEventForm.name,
					updatedAt: new Date(),
				})
				.where(eq(eventGeneric.id, id))
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
