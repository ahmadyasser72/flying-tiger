import { z } from 'zod';

export const formSchema = z.object({
	id: z.number().optional(),
	slug: z
		.string()
		.nonempty({ message: 'Link tidak boleh kosong!' })
		.regex(/^[a-zA-Z0-9._-]*$/, { message: 'Link mengandung karakter yang tidak diperbolehkan!' }),
	judul: z
		.string()
		.nonempty({ message: 'Judul tidak boleh kosong!' })
		.max(64, { message: 'Judul tidak boleh terlalu panjang!' }),
	deskripsi: z.string().nonempty({ message: 'Deskripsi tidak boleh kosong!' }),
	batasWaktu: z
		.date({ message: 'Tanggal batas waktu belum dipilih!' })
		.min(new Date(), { message: 'Tanggal batas waktu sudah terlewati!' })
});

export type FormSchema = typeof formSchema;
