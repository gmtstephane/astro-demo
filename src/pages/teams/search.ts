import { SearchTeams } from '@db/queries/EventSearch';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
	const name = url.searchParams.get('name') || '';
	const teams = await SearchTeams({ name });
	return new Response(JSON.stringify(teams), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
