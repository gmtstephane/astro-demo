import type { User } from '@db/types';
import { defineMiddleware } from 'astro/middleware';
import pkg from 'jsonwebtoken';
import { RefreshToken, secretKey } from './lib/auth/tokens';
const { verify, JsonWebTokenError } = pkg;

const authorizedUrls = ['/api/auth/login', '/api/auth/refresh-token'];

function isPublicRoute(url: URL) {
	return authorizedUrls.some((publicUrl) => {
		return url.pathname.startsWith(publicUrl);
	});
}

export const onRequest = defineMiddleware(({ locals, request, url }, next) => {
	if (isPublicRoute(url)) return next();

	//extract token from the requests, it can be in the authorization header or in the cookies
	const requestTokens = ExtractTokens(request);
	if (!requestTokens.token) return new Response('Unauthorized', { status: 401 });

	try {
		//verify the token
		const decoded = verify(requestTokens.token, secretKey, {});
		locals.user = decoded as User;
		return next();
	} catch (error) {
		//if the token is expired, refresh it, it only works on web clients
		//natives clients will need to refresh token calling the /refresh endpoint
		if (error instanceof JsonWebTokenError && error.message === 'jwt expired') {
			console.log('token expired, refreshing token');
			return ServerSideRefreshRoken(url, requestTokens.refreshToken);
		}

		return new Response('Unauthorized', { status: 401 });
	}
});

interface CookieMap {
	[key: string]: string | undefined; // Use 'undefined' to safely handle cases where the key might not exist
}

// extractTokensFromRequest tries to extract the token from the authrosication bearer token from native cliens
// if it is not present it tries to extract the token from the cookies
// the refreshToken is not present from the native requests
function ExtractTokens(request: Request): { token: string | undefined; refreshToken: string | undefined } {
	const authorization = request.headers.get('Authorization');
	if (authorization) {
		const [bearer, token] = authorization.split(' ');
		if (bearer === 'Bearer') {
			return { token, refreshToken: undefined };
		}
	}

	const cookie = request.headers.get('Cookie');
	if (!cookie) return { token: undefined, refreshToken: undefined };
	return extractCookies(cookie);
}

function extractCookies(cookieString: string): { token: string | undefined; refreshToken: string | undefined } {
	const cookies: CookieMap = {};
	cookieString.split('; ').forEach((cookie) => {
		const [name, value] = cookie.split('=');
		cookies[name] = value;
	});

	const token = cookies['token'];
	const refreshToken = cookies['refreshToken'];
	return { token, refreshToken };
}

function ServerSideRefreshRoken(url: URL, refresh: string | undefined): Response {
	try {
		if (!refresh) return new Response('Unauthorized', { status: 401 });
		const { token, refreshToken } = RefreshToken(refresh);
		return new Response(null, {
			status: 303,
			headers: [
				['Location', url.pathname],
				['Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/;`],
				['Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/;`],
			],
		});
	} catch (error) {
		return new Response('Unauthorized', { status: 401 });
	}
}
