<script lang="ts">
	import type { PageData } from './$types';
	import { columns } from './columns';
	import DataTable from './data-table.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Data pengumpulan {data.judul}</title>
</svelte:head>

<div class="w-full">
	<DataTable data={data.items} {columns} />
</div>
