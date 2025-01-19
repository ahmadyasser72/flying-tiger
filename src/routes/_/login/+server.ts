import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = ({ cookies, url }) => {
	cookies.set('login', '1', { path: '/', maxAge: 60 * 60 });

	redirect(301, url.searchParams.get('redirect') ?? '/');
};
