import { db } from '$lib/server/db';
import { pengumpulanItem } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { error } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params }) => {
	const pengumpulan = await db.query.pengumpulan.findFirst({
		where: (pengumpulan, { eq }) => eq(pengumpulan.slug, params.slug)
	});
	if (pengumpulan === undefined) error(404, 'Not found');

	return {
		pengumpulan,
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const pengumpulan = await db.query.pengumpulan.findFirst({
			columns: { id: true },
			where: (pengumpulan, { eq }) => eq(pengumpulan.slug, event.params.slug)
		});
		if (pengumpulan === undefined) error(404, 'Not found');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		const { nama, file: fileBlob } = form.data;
		const file = await fileBlob.arrayBuffer();
		const fileExt = fileBlob.name.split('.').slice(1).join('.');
		await db
			.insert(pengumpulanItem)
			.values({ nama, file, fileExt, pengumpulanId: pengumpulan.id })
			.onConflictDoUpdate({ target: pengumpulanItem.nama, set: { file, fileExt } })
			.execute();

		return message(form, 'success');
	}
};
