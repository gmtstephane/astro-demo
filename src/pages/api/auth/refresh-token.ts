import { RefreshToken } from '@src/lib/auth/tokens';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
	const body = await request.json();
	if (!body.refreshToken) return new Response('Unauthorized', { status: 401 });

	const { token, refreshToken } = await RefreshToken(body.refreshToken);

	return new Response(JSON.stringify({ token: token, refreshToken: refreshToken }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
};
