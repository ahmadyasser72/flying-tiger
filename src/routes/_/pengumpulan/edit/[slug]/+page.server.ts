import { formSchema } from '$lib/components/pengumpulan-form';
import { db } from '$lib/server/db';
import { pengumpulan } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params }) => {
	const form = await superValidate(zod(formSchema));

	const pengumpulan = await db.query.pengumpulan.findFirst({
		where: (pengumpulan, { eq }) => eq(pengumpulan.slug, params.slug)
	});
	if (pengumpulan === undefined) error(404, 'Not found');

	Object.assign(form.data, pengumpulan);
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		const data = {
			...form.data,
			batasWaktu: new Date(form.data.batasWaktu.valueOf() + 24 * 60 * 60 * 1000 - 1)
		};
		if (data.id === undefined) return fail(400, { form });

		const [{ pengumpulanLink }] = await db
			.update(pengumpulan)
			.set(data)
			.where(eq(pengumpulan.id, data.id))
			.returning({ pengumpulanLink: pengumpulan.slug })
			.execute();

		return { form, redirectTo: `/p/${pengumpulanLink}` };
	}
};
