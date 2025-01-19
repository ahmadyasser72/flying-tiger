<script lang="ts">
	import { page } from '$app/state';
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const route = $derived(page.url.pathname);
</script>

<Toaster />

<div class="container flex min-h-screen flex-col">
	<header class="flex justify-end gap-4 border-b px-8 py-4 max-sm:flex-col max-sm:items-center">
		<a href="/">Home</a>
		{#if data.authorized}
			<a href="/_/pengumpulan/new">Buat pengumpulan</a>
		{:else}
			<a href="/_/login?redirect={route}&t={Date.now()}">Login</a>
		{/if}
	</header>
	<main class="relative mx-auto flex h-full w-full max-w-[60ch] flex-1 py-4">
		{@render children()}
	</main>
</div>
