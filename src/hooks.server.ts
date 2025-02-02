import { ADMIN_KEY } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = ({ event, resolve }) => {
	event.locals.authorized = event.cookies.get('adminKey') === ADMIN_KEY;

	return resolve(event);
};
