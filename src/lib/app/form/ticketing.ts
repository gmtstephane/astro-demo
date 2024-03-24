import { db } from '@db/config';
import { createTicketing } from './schemas';
import { ticketing } from '@db/schema';

export async function CreateTicketing(data: FormData): Promise<Response> {
	try {
		const createEventForm = createTicketing.parse({
			name: data.get('name')?.toString(),
			image: data.get('image')?.toString(),
		});
		const t = await db
			.insert(ticketing)
			.values({
				name: createEventForm.name,
				icon: createEventForm.image,
			})
			.returning();
		return new Response(null, { status: 303, headers: { Location: '/ticketing/' + t[0].id + '?create=true' } });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
}
