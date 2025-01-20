import type { Handle, ServerLoadEvent } from '@sveltejs/kit';

export const handle: Handle = ({ event, resolve }) => {
	const login = event.cookies.get('login') === '1';
	event.locals.authorized = login && basicAuth(event);
	if (!event.locals.authorized && (login || event.url.pathname.startsWith('/_/'))) {
		return new Response('401 Unauthorized', {
			status: 401,
			headers: {
				'WWW-Authenticate': 'Basic realm="admin-only", charset="UTF-8"',
				'Set-Cookie': 'login=; path=/'
			}
		});
	}

	return resolve(event);
};

export const basicAuth = ({ request }: Pick<ServerLoadEvent, 'request'>) => {
	const authorization = request.headers.get('Authorization');
	if (!authorization || !authorization.startsWith('Basic ')) return false;

	const token = authorization.replace('Basic ', '');
	const [username, password] = atob(token).split(':');

	return username === 'admin' && password === 'admin';
};
