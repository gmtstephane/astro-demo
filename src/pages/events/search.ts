import { SearchEvents } from '@db/queries/EventSearch';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
	const name = url.searchParams.get('name') || '';
	const events = await SearchEvents({ name });
	return new Response(JSON.stringify(events), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
