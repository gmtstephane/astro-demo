import type { APIRoute } from 'astro';
import { AuthorizationCode, type AccessToken, type Token } from 'simple-oauth2';
import { AppUrl, GoogleConfig, GoogleUrl } from '.';
import { db } from '@db/config';
import { user } from '@db/schema';
import { eq, and } from 'drizzle-orm';
import type { User } from '@db/queries/types';
import pkg from 'jsonwebtoken';
const { sign } = pkg;

export interface GoogleUserResponse {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	locale: string;
}

export const GET: APIRoute = async ({ request }) => {
	// Parse the code from query parameters
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	// Verify the state parameter
	if (state !== 'random') {
		return new Response('State value did not match', { status: 400 });
	}
	if (!code) {
		return new Response('No code parameter', { status: 400 });
	}

	try {
		//Get the access token from google api
		const accessToken = await GetToken(code);
		//Get the user's profile from google api
		const googleUser = await GetGoogleUser(accessToken.token);
		//Create or get the user from the database
		const dbUser = await FirstOrCreateUser(googleUser);

		const secretKey = 'yourSecretKey';

		// Creating a JWT from the user data
		const token = sign(dbUser, secretKey, { expiresIn: '1h' });

		return new Response(null, {
			status: 303,
			headers: {
				Location: '/',
				'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/;`,
			},
		});
	} catch (error) {
		console.log(error);
		return new Response('error', { status: 500 });
	}
};

async function GetToken(code: string): Promise<AccessToken> {
	const oauth2 = new AuthorizationCode(GoogleConfig);
	return await oauth2.getToken({
		...GoogleUrl,
		code,
	});
}

async function GetGoogleUser(token: Token): Promise<GoogleUserResponse> {
	// Use the access token to retrieve the user's profile information
	const data = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
		headers: {
			Authorization: `Bearer ${token.access_token}`,
		},
	});

	const body: GoogleUserResponse = await data.json();
	return body;
}

async function FirstOrCreateUser(body: GoogleUserResponse): Promise<User> {
	const existingUser = await db.query.user.findFirst({
		where: and(eq(user.provider, 'Google'), eq(user.providerId, body.id)),
	});
	if (existingUser) {
		return existingUser;
	}

	const dbUser = await db
		.insert(user)
		.values({
			email: body.email,
			familyName: body.family_name,
			givenName: body.given_name,
			locale: body.locale,
			name: body.name,
			picture: body.picture,
			provider: 'Google',
			providerId: body.id,
		})
		.returning();

	return dbUser[0];
}
