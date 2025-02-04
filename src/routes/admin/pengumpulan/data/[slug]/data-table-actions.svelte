<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Download, Ellipsis, Eye } from 'lucide-svelte';

	let { id }: { id: number } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative h-8 w-8 p-0">
				<span class="sr-only">Open menu</span>
				<Ellipsis />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>File Actions</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />

			<form action="/admin/pengumpulan/download-item/{id}" method="GET" class="contents">
				<DropdownMenu.Item>
					{#snippet child({ props })}
						<button {...props} formtarget="_blank" type="submit">
							<Eye class="mr-2 h-4 w-4" />
							<span>Lihat</span>
						</button>
					{/snippet}
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					{#snippet child({ props })}
						<button {...props} type="submit" name="download" value="1">
							<Download class="mr-2 h-4 w-4" />
							<span>Download</span>
						</button>
					{/snippet}
				</DropdownMenu.Item>
			</form>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
