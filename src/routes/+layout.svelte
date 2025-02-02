<script lang="ts">
	import { page } from '$app/state';
	import AuthorizeForm from '$lib/components/authorize-form.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';
	import type { LayoutData } from './$types';
	import { ProgressBar } from '@prgm/sveltekit-progress-bar';
	import type { Snippet } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const flash = getFlash(page);
	$effect(() => {
		if ($flash !== undefined) toast[$flash.type]($flash.message);
	});

	let progressBar = $state<ReturnType<typeof ProgressBar>>();
</script>

<ProgressBar class="text-current" bind:this={progressBar} />
<Toaster />

<div
	class="container flex min-h-screen flex-col bg-white"
	class:brightness-90={progressBar?.getState().running}
>
	<header
		class="flex flex-wrap items-center justify-center gap-4 border-b px-8 py-4 text-center sm:justify-end"
	>
		<a href="/">Home</a>

		{#if data.authorized}
			<a href="/_/pengumpulan/new">Buat pengumpulan</a>
		{/if}

		<AuthorizeForm />
	</header>

	<main class="relative mx-auto flex h-full w-full max-w-[60ch] flex-1 flex-col py-4">
		{@render children()}
	</main>
</div>
