import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const pengumpulan = await db.query.pengumpulan.findFirst({
		columns: { judul: true },
		where: (pengumpulan, { eq }) => eq(pengumpulan.slug, params.slug),
		with: { items: { columns: { id: true, nama: true, waktuPengumpulan: true, fileSize: true } } }
	});
	if (pengumpulan === undefined) error(404, 'Not found');

	return pengumpulan;
};
