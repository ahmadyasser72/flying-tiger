import { z } from 'zod';

export const formSchema = z.object({
	nama: z.string().nonempty({ message: 'Nama tidak boleh kosong!' }),
	file: z
		.instanceof(File, { message: 'File belum dipilih!' })
		.refine((f) => f.size < 10_000_000, { message: 'File tidak boleh lebih besar dari 10MB!' })
});

export type FormSchema = typeof formSchema;
