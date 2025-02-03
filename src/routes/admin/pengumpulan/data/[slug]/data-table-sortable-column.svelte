<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import type { ComponentProps } from 'svelte';

	interface Props {
		label: string;
	}

	let {
		column,
		variant = 'ghost',
		...restProps
	}: ComponentProps<typeof Button> & { column: Props } = $props();
</script>

<Button {variant} {...restProps}>
	{column.label}
	<ArrowUpDown class="ml-2 size-4" />
</Button>
