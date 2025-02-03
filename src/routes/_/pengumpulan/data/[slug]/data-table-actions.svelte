<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let { id }: { id: number } = $props();
	const url = $derived(`/_/pengumpulan/download-item/${id}`);
</script>

<div class="flex gap-x-2">
	<Button target="_blank" href={url} size="sm">Lihat</Button>
	<Button href="{url}?download=1" size="sm">Download</Button>
</div>
