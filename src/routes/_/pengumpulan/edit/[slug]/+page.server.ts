import { formSchema } from '$lib/components/pengumpulan-form';
import { db } from '$lib/server/db';
import { pengumpulan } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params }) => {
	const pengumpulan = await db.query.pengumpulan.findFirst({
		where: (pengumpulan, { eq }) => eq(pengumpulan.slug, params.slug)
	});
	if (pengumpulan === undefined) error(404, 'Not found');

	return {
		form: await superValidate(pengumpulan, zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });
		else if (form.data.id === undefined) return fail(400, { form });

		const existing = await db.query.pengumpulan
			.findFirst({
				where: (pengumpulan, { and, eq, ne }) =>
					and(eq(pengumpulan.slug, form.data.slug), ne(pengumpulan.id, form.data.id!))
			})
			.execute();
		if (existing !== undefined) {
			return setError(form, 'slug', 'Link tidak tersedia!');
		}

		const [{ slug }] = await db
			.update(pengumpulan)
			.set(form.data)
			.where(eq(pengumpulan.id, form.data.id))
			.returning({ slug: pengumpulan.slug })
			.execute();

		redirect(`/p/${slug}`, { type: 'success', message: `Berhasil update pengumpulan!` }, event);
	}
};
