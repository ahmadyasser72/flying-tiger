import { formSchema } from '$lib/components/pengumpulan-form';
import { db } from '$lib/server/db';
import { pengumpulan } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
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

		const [{ pengumpulanLink }] = await db
			.insert(pengumpulan)
			.values(form.data)
			.returning({ pengumpulanLink: pengumpulan.slug })
			.onConflictDoUpdate({ target: pengumpulan.slug, set: form.data })
			.execute();

		redirect(
			`/p/${pengumpulanLink}`,
			{ type: 'success', message: 'Pengumpulan berhasil dibuat!' },
			event
		);
	}
};
