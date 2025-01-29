<script lang="ts">
	import { CircleAlert } from 'lucide-svelte';

	let { status, message }: { status?: number; message: string } = $props();
</script>

<div class="flex flex-1 flex-col items-center justify-center">
	<CircleAlert class="h-32 w-32 text-red-500" />

	{#if status !== undefined}
		<p class="text-2xl font-bold text-red-500">Error {status}</p>
	{/if}

	<p class="mt-2 text-center text-xl font-semibold">{message}</p>
</div>
