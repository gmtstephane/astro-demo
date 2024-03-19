import { AuthorizationCode, type AccessToken, type Token } from 'simple-oauth2';
import { AppUrl } from '../app/app';
import type { User } from '@db/queries/types';
import { db } from '@db/config';
import { and, eq } from 'drizzle-orm';
import { user } from '@db/schema';
import { GenerateJwts } from './tokens';
import { google } from 'googleapis';

export namespace Google {
	const clientId = import.meta.env.GOOGLE_CLIENT_ID;
	const clientSecret = import.meta.env.GOOGLE_CLIENT_SECRET;
	const clientIdIOS = import.meta.env.GOOGLE_CLIENT_ID_IOS;

	const Config = {
		client: {
			id: clientId,
			secret: clientSecret,
		},
		auth: {
			tokenHost: 'https://accounts.google.com',
			tokenPath: '/o/oauth2/token',
			authorizePath: '/o/oauth2/auth',
		},
	};

	const GoogleUrl = {
		redirect_uri: AppUrl + '/api/auth/login/google/callback',
		scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
		state: 'random',
	};

	interface GoogleUserResponse {
		id: string;
		email: string;
		verified_email: boolean;
		name: string;
		given_name: string;
		family_name: string;
		picture: string;
		locale: string;
	}

	//FirstOrCreateUser function checks if a user exists in the database, if not it creates a new user
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

	//Native namespace handle functions to login with Google on the native part
	//The native application authenticate independently from the web application
	//it then send it's google Idtoken to authenticate with the server
	//Then we fetch back the user's profile information and create a user in the database
	export namespace Native {
		export async function Login(idToken: string) {
			const googleUser = await verifyNativeGoogleToken(idToken);
			const dbUser = await FirstOrCreateUser(googleUser);
			return await GenerateJwts(dbUser);
		}

		async function verifyNativeGoogleToken(idToken: string): Promise<GoogleUserResponse> {
			const client = new google.auth.OAuth2(Config.client.id, Config.client.secret);
			const ticket = await client.verifyIdToken({
				idToken: idToken,
				audience: clientIdIOS,
			});

			const payload = ticket.getPayload();
			if (!payload) throw new Error('No payload');
			const user: GoogleUserResponse = {
				email: payload.email as string,
				locale: payload.locale as string,
				verified_email: payload.email_verified as boolean,
				id: payload.sub as string,
				name: payload.name as string,
				given_name: payload.given_name as string,
				family_name: payload.family_name as string,
				picture: payload.picture as string,
			};
			return user;
		}
	}

	//Web namesapce handle functions to login with Google on the web
	//it includes oauth steps to get an accessToken and then get the user's profile information
	export namespace Web {
		//GetAccessToken function retreives an accessToken using a code
		//The code is obtained from the redirect url after the user logs in with Google
		async function GetAccessToken(code: string): Promise<AccessToken> {
			const oauth2 = new AuthorizationCode(Config);
			return await oauth2.getToken({
				...GoogleUrl,
				code,
			});
		}

		//GetGoogleUser function retreives a user's profile information using an accessToken
		//This is used on web login, with the accessToken get from the AuthorizationCode
		async function GetGoogleUser(accessToken: Token): Promise<GoogleUserResponse> {
			// Use the access token to retrieve the user's profile information
			const data = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
				headers: {
					Authorization: `Bearer ${accessToken.access_token}`,
				},
			});

			const body: GoogleUserResponse = await data.json();
			return body;
		}

		export async function Login(code: string) {
			const accessToken = await GetAccessToken(code);
			const googleUser = await GetGoogleUser(accessToken.token);
			const dbUser = await FirstOrCreateUser(googleUser);
			return GenerateJwts(dbUser);
		}

		export async function AuthUrl() {
			const oauth2 = new AuthorizationCode(Config);
			const authorizationUri = oauth2.authorizeURL(GoogleUrl);
			return authorizationUri;
		}
	}
}
