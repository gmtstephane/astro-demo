import type { APIRoute } from 'astro';
import { Google } from '@src/lib/auth/google';

export const GET: APIRoute = async ({ request }) => {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	if (state !== 'random') return new Response('State value did not match', { status: 400 });
	if (!code) return new Response('No code parameter', { status: 400 });

	try {
		const { token, refreshToken } = await Google.Web.Login(code);
		return new Response(null, {
			status: 303,
			headers: [
				['Location', '/events/new/player'],
				['Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/;`],
				['Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/;`],
			],
		});
	} catch (error) {
		console.log(error);
		return new Response('error', { status: 500 });
	}
};
