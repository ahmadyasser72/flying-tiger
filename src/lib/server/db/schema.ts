import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core';

export const pengumpulan = sqliteTable('pengumpulan', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	slug: text('slug').unique().notNull(),
	judul: text('title').notNull(),
	deskripsi: text('description').notNull(),
	batasWaktu: integer('time_limit', { mode: 'timestamp_ms' }).notNull()
});

export const pengumpulanRelations = relations(pengumpulan, ({ many }) => ({
	items: many(pengumpulanItem)
}));

export const pengumpulanItem = sqliteTable('pengumpulan_item', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	pengumpulanId: integer('pengumpulan_id')
		.references(() => pengumpulan.id)
		.notNull(),
	nama: text('name').unique().notNull(),
	waktuPengumpulan: integer('submit_time', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
	file: blob('file', { mode: 'buffer' }).$type<ArrayBuffer>().notNull(),
	fileExt: text('file_ext').notNull(),
	fileSize: integer('file_size').notNull()
});

export const pengumpulanItemRelations = relations(pengumpulanItem, ({ one }) => ({
	pengumpulan: one(pengumpulan, {
		fields: [pengumpulanItem.pengumpulanId],
		references: [pengumpulan.id]
	})
}));
