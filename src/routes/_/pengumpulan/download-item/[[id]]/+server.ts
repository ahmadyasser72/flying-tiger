import { db } from '$lib/server/db';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { createZip } from 'littlezipper';
import mime from 'mime';

const downloadSingle = async (id: number, forceDownload: boolean) => {
	if (isNaN(id)) error(404, 'Not found');

	const item = await db.query.pengumpulanItem.findFirst({
		columns: { nama: true, file: true, fileExt: true },
		where: (item, { eq }) => eq(item.id, id)
	});
	if (item === undefined) error(404, 'Not found');

	const { nama, file, fileExt } = item;
	const headers = new Headers({
		'Content-Length': file.byteLength.toString(),
		'Content-Type': mime.getType(fileExt) ?? 'application/octet-stream',
		'Content-Disposition': `${forceDownload ? 'attachment' : 'inline'}; filename="${nama}.${fileExt}"`
	});

	return new Response(file, { headers });
};

const downloadMultiple = async (ids: number[]) => {
	if (ids.some(isNaN)) error(400, 'Bad request');

	const items = await db.query.pengumpulanItem.findMany({
		columns: { nama: true, file: true, fileExt: true, waktuPengumpulan: true },
		where: (item, { eq, or }) => or(...ids.map((id) => eq(item.id, id))),
		with: { pengumpulan: { columns: { judul: true } } }
	});
	if (items.length === 0) error(404, 'Not found');

	const zipFile = await createZip(
		items.map(({ nama, file, fileExt, waktuPengumpulan }) => ({
			path: `${nama}.${fileExt}`,
			data: file,
			lastModified: waktuPengumpulan
		}))
	);

	return new Response(zipFile, {
		headers: {
			'Content-Length': zipFile.length.toString(),
			'Content-Type': 'application/zip',
			'Content-Disposition': `attachment; filename="${items[0].pengumpulan.judul}.zip"`
		}
	});
};

export const GET: RequestHandler = async ({ params, url }) => {
	if (params.id === undefined) error(404, 'Not found');

	const id = Number(params.id);
	const forceDownload = url.searchParams.get('download') === '1';
	return downloadSingle(id, forceDownload);
};

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	const ids = form.getAll('id');
	if (ids.length === 0) error(400, 'Bad request');

	return downloadMultiple(ids.map(Number));
};
