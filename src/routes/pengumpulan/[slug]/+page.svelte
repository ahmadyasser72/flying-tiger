<script lang="ts">
	import { page } from '$app/state';
	import ErrorView from '$lib/components/error-view.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';
	import PengumpulanView from './pengumpulan-view.svelte';
	import { LoaderPinwheel } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	{#await data.pengumpulan}
		<title>Pengumpulan {page.params.slug}</title>
	{:then pengumpulan}
		<title>Pengumpulan {pengumpulan?.judul ?? 'tidak ditemukan!'}</title>
	{/await}
</svelte:head>

<div class="flex w-full flex-1 flex-col items-center">
	{#if data.authorized}
		<div class="mb-4 flex w-full flex-wrap gap-2 border-b pb-4">
			<Button href="/admin/pengumpulan/data/{page.params.slug}">Lihat data</Button>
			<Button href="/admin/pengumpulan/edit/{page.params.slug}">Edit pengumpulan</Button>
		</div>
	{/if}

	{#await data.pengumpulan}
		<div class="flex flex-1 flex-col items-center justify-center">
			<LoaderPinwheel class="h-32 w-32 animate-spin" />
			<p class="mt-2 text-xl font-semibold">Loading pengumpulan...</p>
		</div>
	{:then pengumpulan}
		{#if pengumpulan !== undefined}
			<PengumpulanView {pengumpulan} form={data.form} />
		{:else}
			<ErrorView message="Pengumpulan tidak ditemukan!" status={404} />
		{/if}
	{/await}
</div>
