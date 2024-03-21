import type { APIRoute } from 'astro';
import { GetEventUnion } from '@db/queries/EventList';

export const GET: APIRoute = async ({}) => {
	try {
		const events = await GetEventUnion();
		return new Response(JSON.stringify(events.rows));
	} catch (error) {
		return new Response(JSON.stringify({ error: error }), { status: 500 });
	}
};
