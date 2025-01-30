<script lang="ts">
	import { page } from '$app/state';
	import ErrorView from '$lib/components/error-view.svelte';

	const message = $derived(page.error?.message ?? String({}));
</script>

<svelte:head>
	<title>Error {page.status} - {message}</title>
</svelte:head>

<ErrorView {message} status={page.status} />
