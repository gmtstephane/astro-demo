import type { User } from '@sentry/astro';
import pkg, { type JwtPayload } from 'jsonwebtoken';
const { sign, verify } = pkg;

export const secretKey = 'yourSecretKey';
export const refreshSecretKey = 'yourSecretRefreshKey';

export function GenerateJwts(user: User): { token: string; refreshToken: string } {
	const token = sign(user, secretKey, { expiresIn: '24h' });
	const refreshToken = sign(user, refreshSecretKey, { expiresIn: '31d' });
	return { token, refreshToken };
}

export function RefreshToken(refreshToken: string): { token: string; refreshToken: string } {
	const decoded = verify(refreshToken, refreshSecretKey, {});
	const payload: JwtPayload = decoded as JwtPayload;
	delete payload.iat;
	delete payload.exp;
	const user: User = payload as User;
	return GenerateJwts(user);
}
