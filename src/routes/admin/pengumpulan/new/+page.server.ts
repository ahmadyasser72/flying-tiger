import { formSchema } from '$lib/components/pengumpulan-form';
import { db } from '$lib/server/db';
import { pengumpulan } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';
import { redirect } from 'sveltekit-flash-message/server';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		const existing = await db.query.pengumpulan
			.findFirst({ where: (pengumpulan, { eq }) => eq(pengumpulan.slug, form.data.slug) })
			.execute();
		if (existing !== undefined) {
			return setError(form, 'slug', 'Link tidak tersedia!');
		}

		const [{ slug }] = await db
			.insert(pengumpulan)
			.values(form.data)
			.returning({ slug: pengumpulan.slug })
			.execute();

		redirect(`/p/${slug}`, { type: 'success', message: 'Pengumpulan berhasil dibuat!' }, event);
	}
};
