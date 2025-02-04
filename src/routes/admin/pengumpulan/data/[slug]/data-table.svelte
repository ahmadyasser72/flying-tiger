<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table';
	import * as Table from '$lib/components/ui/table';
	import type { PengumpulanItem } from './columns';
	import {
		type ColumnDef,
		getCoreRowModel,
		getSortedRowModel,
		type RowSelectionState,
		type SortingState
	} from '@tanstack/table-core';
	import prettyBytes from 'pretty-bytes';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
	};

	let { data, columns }: DataTableProps<PengumpulanItem, ColumnDef<PengumpulanItem>[]> = $props();
	let sorting = $state<SortingState>([]);
	let rowSelection = $state<RowSelectionState>({});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		state: {
			get sorting() {
				return sorting;
			},
			get rowSelection() {
				return rowSelection;
			}
		}
	});

	const selectedRows = $derived(table.getSelectedRowModel().rows);
</script>

<div class="mb-2 flex flex-wrap justify-between gap-2 max-sm:flex-col-reverse">
	<form action="/admin/pengumpulan/download-item" method="POST" class="contents">
		{#if selectedRows.length > 0}
			{@const totalSize = selectedRows.reduce((acc, { original }) => acc + original.fileSize, 0)}
			{@const humanTotalSize = prettyBytes(totalSize, { space: false })}
			<Button type="submit">Download {selectedRows.length} data (~{humanTotalSize})</Button>

			{#each selectedRows as { original }}
				<input type="hidden" name="id" value={original.id} />
			{/each}
		{:else}
			<Button disabled>Pilih data yang ingin di download &hellip;</Button>
		{/if}
	</form>

	<Button target="_blank" href="/p/{page.params.slug}" variant="outline">Buka pengumpulan</Button>
</div>

<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row data-state={row.getIsSelected() && 'selected'}>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
