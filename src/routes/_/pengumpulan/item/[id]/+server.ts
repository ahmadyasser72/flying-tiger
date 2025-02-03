import { db } from '$lib/server/db';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { createZip } from 'littlezipper';
import mime from 'mime';

const downloadSingle = async (id: number, download: boolean) => {
	const item = await db.query.pengumpulanItem.findFirst({
		columns: { nama: true, file: true, fileExt: true },
		where: (item, { eq }) => eq(item.id, id)
	});
	if (item === undefined) error(404, 'Not found');

	const { nama, file, fileExt } = item;
	const headers = new Headers({
		'Content-Length': file.byteLength.toString(),
		'Content-Type': mime.getType(fileExt) ?? 'application/octet-stream',
		'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${nama}.${fileExt}"`
	});

	return new Response(file, { headers });
};

const downloadMultiple = async (ids: number[]) => {
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
	const ids = params.id.split('+');
	if (ids.length > 1) {
		return downloadMultiple(ids.map(Number));
	} else {
		const id = Number(ids[0]);
		return downloadSingle(id, url.searchParams.get('download') === '1');
	}
};
