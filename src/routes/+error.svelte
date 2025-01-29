<script lang="ts">
	import { page } from '$app/state';
	import ErrorView from '$lib/components/error-view.svelte';
</script>

<ErrorView message={page.error?.message ?? String({})} status={page.status} />
