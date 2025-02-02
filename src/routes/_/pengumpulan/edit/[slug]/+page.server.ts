import { formSchema } from '$lib/components/pengumpulan-form';
import { db } from '$lib/server/db';
import { pengumpulan } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
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

		const [{ pengumpulanLink }] = await db
			.update(pengumpulan)
			.set(form.data)
			.where(eq(pengumpulan.id, form.data.id))
			.returning({ pengumpulanLink: pengumpulan.slug })
			.execute();

		redirect(
			`/p/${pengumpulanLink}`,
			{ type: 'success', message: `Pengumpulan #${form.data.id} berhasil diperbarui!` },
			event
		);
	}
};
