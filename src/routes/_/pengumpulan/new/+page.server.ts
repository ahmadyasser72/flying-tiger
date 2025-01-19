import { formSchema } from '$lib/components/pengumpulan-form';
import { db } from '$lib/server/db';
import { pengumpulan } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
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

		const data = {
			...form.data,
			batasWaktu: new Date(form.data.batasWaktu.valueOf() + 24 * 60 * 60 * 1000 - 1)
		};

		const [{ pengumpulanLink }] = await db
			.insert(pengumpulan)
			.values(data)
			.returning({ pengumpulanLink: pengumpulan.slug })
			.onConflictDoUpdate({ target: pengumpulan.slug, set: data })
			.execute();

		return { form, redirectTo: `/p/${pengumpulanLink}` };
	}
};
