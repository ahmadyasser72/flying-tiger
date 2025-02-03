<script lang="ts">
	import { PengumpulanForm } from '$lib/components/pengumpulan-form';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Edit pengumpulan #{data.form.data.id}</title>
</svelte:head>

<PengumpulanForm {data} />
