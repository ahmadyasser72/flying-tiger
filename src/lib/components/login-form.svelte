<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Popover from '$lib/components/ui/popover';

	let open = $state(false);
</script>

{#snippet form()}
	<form
		method="get"
		action={page.url.href}
		onsubmit={() => {
			open = false;
			invalidate('admin:authorize');
		}}
		class="grid gap-2"
	>
		{#if page.data.authorized}
			<input type="hidden" name="noAdminKey" value="1" />
			<button type="submit">Logout</button>
		{:else}
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="adminKey">Key</Label>
				<Input id="adminKey" type="text" name="adminKey" class="col-span-3 h-8" />
			</div>
			<Button type="submit">Authorize</Button>
		{/if}
	</form>
{/snippet}

{#if page.data.authorized}
	{@render form()}
{:else}
	<Popover.Root bind:open>
		<Popover.Trigger>Login</Popover.Trigger>
		<Popover.Content class="w-64">
			<div class="grid gap-4">
				<div class="space-y-2">
					<h4 class="font-medium leading-none">Login Admin</h4>
					<p class="text-sm text-muted-foreground">Masukkan kata kunci admin.</p>
				</div>

				{@render form()}
			</div>
		</Popover.Content>
	</Popover.Root>
{/if}
