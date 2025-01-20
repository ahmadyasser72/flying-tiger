<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const login = () => {
		document.cookie = `login=1; path=/`;
		window.location.reload();
	};
	const logout = () => {
		document.cookie = `login=; path=/`;
		window.location.reload();
	};
</script>

<Toaster />

<div class="container flex min-h-screen flex-col">
	<header class="flex flex-wrap justify-center gap-4 border-b px-8 py-4 text-center sm:justify-end">
		<a href="/">Home</a>
		{#if data.authorized}
			<a href="/_/pengumpulan/new">Buat pengumpulan</a>
			<button onclick={logout}>Logout</button>
		{:else}
			<button onclick={login}>Login</button>
		{/if}
	</header>
	<main class="relative mx-auto flex h-full w-full max-w-[60ch] flex-1 py-4">
		{@render children()}
	</main>
</div>
