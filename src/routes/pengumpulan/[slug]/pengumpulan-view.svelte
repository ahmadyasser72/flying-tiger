<script lang="ts">
	import { dateTimeFormatter } from '$lib/utils';
	import type { PageData } from './$types';
	import PengumpulanForm from './pengumpulan-form.svelte';
	import { formatDistanceToNow } from 'date-fns';
	import { id } from 'date-fns/locale';

	let {
		pengumpulan,
		form
	}: { pengumpulan: NonNullable<Awaited<PageData['pengumpulan']>>; form: PageData['form'] } =
		$props();

	const lewatBatasWaktu = $derived(new Date() >= pengumpulan.batasWaktu);

	const [pengumpulanTerakhir, pengumpulanTerakhirDistance] = $derived([
		dateTimeFormatter.format(pengumpulan.batasWaktu),
		formatDistanceToNow(pengumpulan.batasWaktu, { locale: id })
	]);
</script>

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
	<p class="text-center text-lg font-semibold text-red-600 underline">
		Pengumpulan ini sudah ditutup!
	</p>
{/if}

<PengumpulanForm class="mt-8" data={{ form }} disabled={lewatBatasWaktu} />
