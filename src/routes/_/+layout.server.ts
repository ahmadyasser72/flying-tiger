import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.authorized) error(401, { message: 'Halaman ini khusus untuk admin!' });
};
