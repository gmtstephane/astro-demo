import { Google } from '@src/lib/auth/google';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
	const body = await request.json();
	if (!body.idToken) return new Response('Unauthorized', { status: 401 });

	try {
		const { token, refreshToken } = await Google.Native.Login(body.idToken);

		return new Response(JSON.stringify({ token: token, refreshToken: refreshToken }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (e) {
		console.log(e);
		return new Response(
			JSON.stringify({
				error: e,
			}),
			{ status: 500 }
		);
	}
};
