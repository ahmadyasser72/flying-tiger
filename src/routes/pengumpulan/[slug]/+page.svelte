<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { dateTimeFormatter } from '$lib/utils';
	import type { PageData } from './$types';
	import UploadPengumpulanForm from './upload-pengumpulan-form.svelte';
	import { formatDistanceToNow } from 'date-fns';
	import { id } from 'date-fns/locale';

	let { data }: { data: PageData } = $props();

	const { pengumpulan } = $derived(data);
	const lewatBatasWaktu = $derived(new Date() >= pengumpulan.batasWaktu);

	const [pengumpulanTerakhir, pengumpulanTerakhirDistance] = $derived([
		dateTimeFormatter.format(pengumpulan.batasWaktu),
		formatDistanceToNow(pengumpulan.batasWaktu, { locale: id })
	]);
</script>

<svelte:head>
	<title>Pengumpulan {pengumpulan.judul}</title>
</svelte:head>

<div class="flex w-full flex-col items-center">
	{#if data.authorized}
		<div class="mb-4 flex w-full gap-2 border-b pb-4">
			<Button href="/_/pengumpulan/data/{page.params.slug}">Lihat data</Button>
			<Button href="/_/pengumpulan/edit/{page.params.slug}">Edit pengumpulan</Button>
		</div>
	{/if}

	<h1 class="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
		{pengumpulan.judul}
	</h1>

	<p class="mt-2 text-center text-sm">
		<span>{pengumpulanTerakhir}</span>
		<span class="font-semibold">
			({#if lewatBatasWaktu}
				terlambat {pengumpulanTerakhirDistance}
			{:else}
				{pengumpulanTerakhirDistance} lagi
			{/if})
		</span>
	</p>

	<p class="mt-4 text-center" class:line-through={lewatBatasWaktu}>
		{pengumpulan.deskripsi}.
	</p>

	{#if lewatBatasWaktu}
		<p class="text-center">Pengumpulan ini sudah ditutup!</p>
	{/if}

	<div class="mt-8">
		<UploadPengumpulanForm {data} disabled={lewatBatasWaktu} />
	</div>
</div>
