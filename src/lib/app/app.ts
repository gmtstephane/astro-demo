export const AppUrl = import.meta.env.APP_URL || 'http://192.168.1.14:4321';

export function IsUpdateRessource(u: URL): boolean {
	return u.searchParams.get('update') === 'true';
}

export function IsCreateRessource(u: URL): boolean {
	return u.searchParams.get('create') === 'true';
}
