import { ADMIN_KEY } from '$env/static/private';
import type { Actions } from './$types';
import { redirect } from 'sveltekit-flash-message/server';

export const actions: Actions = {
	login: async (event) => {
		const form = await event.request.formData();

		const key = form.get('adminKey');
		if (key === ADMIN_KEY) {
			event.cookies.set('adminKey', key, { path: '/', sameSite: 'strict' });
			redirect({ type: 'success', message: 'Login berhasil!' }, event);
		} else {
			redirect({ type: 'error', message: 'Kata kunci admin salah!' }, event);
		}
	},
	logout: async (event) => {
		event.cookies.delete('adminKey', { path: '/', sameSite: 'strict' });
		redirect({ type: 'success', message: 'Logout berhasil!' }, event);
	}
};
