import type { User } from '@db/queries/types';
import { defineMiddleware } from 'astro/middleware';
import pkg from 'jsonwebtoken';
const { verify } = pkg;

const secretKey = 'yourSecretKey';

const authorizedUrls = ['/login'];

function isPublicRoute(url: URL) {
	return authorizedUrls.some((publicUrl) => {
		return url.pathname.startsWith(publicUrl);
	});
}

export const onRequest = defineMiddleware(({ locals, request, url }, next) => {
	if (isPublicRoute(url)) return next();

	//get token from cookie
	const cookie = request.headers.get('Cookie');
	if (!cookie) return new Response('Unauthorized', { status: 401 });

	const token = cookie.split('token=')[1];
	const decoded = verify(token, secretKey);
	locals.user = decoded as User;
	return next();
});
