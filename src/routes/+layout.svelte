<script lang="ts">
	import { page } from '$app/state';
	import LoginForm from '$lib/components/login-form.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const flash = getFlash(page);
	$effect(() => {
		if ($flash !== undefined) toast[$flash.type]($flash.message);
	});
</script>

<Toaster />

<div class="container flex min-h-screen flex-col">
	<header
		class="flex flex-wrap items-center justify-center gap-4 border-b px-8 py-4 text-center sm:justify-end"
	>
		<a href="/">Home</a>

		{#if data.authorized}
			<a href="/_/pengumpulan/new">Buat pengumpulan</a>
		{/if}

		<LoginForm />
	</header>

	<main class="relative mx-auto flex h-full w-full max-w-[60ch] flex-1 flex-col py-4">
		{@render children()}
	</main>
</div>
