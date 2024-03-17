import type { APIRoute } from 'astro';
import { AuthorizationCode } from 'simple-oauth2';

export const clientID = import.meta.env.GOOGLE_CLIENT_ID;
export const clientSecret = import.meta.env.GOOGLE_CLIENT_SECRET;
export const AppUrl = import.meta.env.APP_URL || 'http://localhost:4321';

console.log('using app url', AppUrl);
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

export const GoogleUrl = {
	redirect_uri: AppUrl + '/login/google/callback',
	scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
	state: 'random',
};

export const GET: APIRoute = async ({}) => {
	const oauth2 = new AuthorizationCode(GoogleConfig);
	const authorizationUri = oauth2.authorizeURL(GoogleUrl);

	return new Response(null, { status: 303, headers: { Location: authorizationUri } });
};
