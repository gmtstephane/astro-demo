import { db } from '@db/config';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({}) => {
	try {
		return new Response(
			JSON.stringify(
				await db.query.eventTeam.findMany({
					with: {
						awayTeam: true,
						homeTeam: true,
						tickets: true,
					},
				})
			)
		);
	} catch (error) {
		return new Response(JSON.stringify({ error: error }), { status: 500 });
	}
};
