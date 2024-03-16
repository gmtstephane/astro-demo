import { db } from '@db/config';
import { users } from '@db/schema';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request }) => {
	try {
		return new Response(JSON.stringify(await db.select().from(users)));
	} catch (error) {
		return new Response(JSON.stringify({ error: error }), { status: 500 });
	}
};
