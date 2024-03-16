import { db } from '@db/config';
import { team } from '@db/schema';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({}) => {
	try {
		return new Response(
			JSON.stringify(
				await db.query.team.findMany({
					with: {
						teamToChampionships: true,
					},
				})
			)
		);
	} catch (error) {
		return new Response(JSON.stringify({ error: error }), { status: 500 });
	}
};
