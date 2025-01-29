import { ADMIN_KEY } from '$env/static/private';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

export const handle: Handle = ({ event, resolve }) => {
	event.locals.authorized = authorizeAdmin(event);

	return resolve(event);
};

export const authorizeAdmin = ({ cookies, url }: Pick<RequestEvent, 'cookies' | 'url'>) => {
	const cookieKey = cookies.get('adminKey');
	if (cookieKey === ADMIN_KEY && !url.searchParams.has('noAdminKey')) return true;
	else {
		cookies.delete('adminKey', { path: '/' });
		if (url.searchParams.has('noAdminKey')) {
			url.searchParams.delete('noAdminKey');
			redirect(url, { type: 'success', message: 'Logout berhasil!' }, cookies);
		}
	}

	const urlQueryKey = url.searchParams.get('adminKey');
	if (urlQueryKey === null) return false;

	url.searchParams.delete('adminKey');
	if (urlQueryKey === ADMIN_KEY) {
		cookies.set('adminKey', urlQueryKey, { path: '/' });
		redirect(url, { type: 'success', message: 'Login berhasil!' }, cookies);
	} else {
		redirect(url, { type: 'error', message: 'Kata kunci admin salah!' }, cookies);
	}
};
