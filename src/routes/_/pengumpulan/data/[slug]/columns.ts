import { Checkbox } from '$lib/components/ui/checkbox';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import { dateTimeFormatter } from '$lib/utils';
import DataTableActions from './data-table-actions.svelte';
import DataTableSortableColumn from './data-table-sortable-column.svelte';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';

export interface PengumpulanItem {
	id: number;
	nama: string;
	waktuPengumpulan: Date;
}

export const columns: ColumnDef<PengumpulanItem>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(Checkbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all'
			}),
		cell: ({ row }) =>
			renderComponent(Checkbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(!!value),
				'aria-label': 'Select row'
			})
	},
	{
		accessorKey: 'nama',
		header: ({ column }) =>
			renderComponent(DataTableSortableColumn, {
				column: { label: 'Nama' },
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	},
	{
		accessorKey: 'waktuPengumpulan',
		header: ({ column }) =>
			renderComponent(DataTableSortableColumn, {
				column: { label: 'Waktu Pengumpulan' },
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ row }) => {
			const submitTimeSnippet = createRawSnippet<[string]>((getSubmitTime) => {
				const submitTime = getSubmitTime();
				return {
					render: () => `<div class="font-medium">${submitTime}</div>`
				};
			});

			return renderSnippet(
				submitTimeSnippet,
				dateTimeFormatter.format(row.getValue('waktuPengumpulan'))
			);
		}
	},
	{
		accessorKey: 'file',
		header: 'File',
		cell: ({ row }) => renderComponent(DataTableActions, { id: row.original.id })
	}
];
