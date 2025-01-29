import type { LayoutServerLoad } from './$types';
import { loadFlash } from 'sveltekit-flash-message/server';

export const load: LayoutServerLoad = loadFlash(({ locals: { authorized }, depends }) => {
	depends('admin:authorize');
	return { authorized };
});
