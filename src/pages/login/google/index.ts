import type { APIRoute } from 'astro';
import { AuthorizationCode } from 'simple-oauth2';

const clientID = import.meta.env.GOOGLE_CLIENT_ID;
const clientSecret = import.meta.env.GOOGLE_CLIENT_SECRET;

export const GoogleConfig = {
	client: {
		id: clientID,
		secret: clientSecret,
	},
	auth: {
		tokenHost: 'https://accounts.google.com',
		tokenPath: '/o/oauth2/token',
		authorizePath: '/o/oauth2/auth',
	},
};

export const GET: APIRoute = async ({}) => {
	const oauth2 = new AuthorizationCode(GoogleConfig);
	const authorizationUri = oauth2.authorizeURL({
		redirect_uri: 'http://localhost:4321/login/google/callback',
		scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
		state: 'random',
	});

	return new Response(null, { status: 303, headers: { Location: authorizationUri } });
};
