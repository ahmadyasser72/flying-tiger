<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Popover from '$lib/components/ui/popover';
	import { LoaderPinwheel } from 'lucide-svelte';

	let loading = $state(false);
	let popoverOpen = $state(false);
</script>

{#snippet submitButtonLoader()}
	{#if loading}
		<LoaderPinwheel class="h-6 w-6 animate-spin" />
	{/if}
{/snippet}

{#snippet authorizeForm(type: 'login' | 'logout')}
	<form
		action="/authorize?/{type}"
		method="POST"
		class="grid gap-2"
		use:enhance={() => {
			// tunggu 300ms sebelum menampilkan loading indicator
			const loadingTimeout = setTimeout(() => (loading = true), 300);

			return async () => {
				clearTimeout(loadingTimeout);
				await invalidate('admin:authorize');
				loading = popoverOpen = false;
			};
		}}
	>
		{#if type === 'login'}
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="adminKey">Key</Label>
				<Input id="adminKey" type="text" name="adminKey" class="col-span-3 h-8" />
			</div>
			<Button type="submit" disabled={loading}>
				Authorize
				{@render submitButtonLoader()}
			</Button>
		{:else}
			<button type="submit" disabled={loading} class="inline-flex items-center gap-2">
				Logout
				{@render submitButtonLoader()}
			</button>
		{/if}
	</form>
{/snippet}

{#if page.data.authorized}
	{@render authorizeForm('logout')}
{:else}
	<Popover.Root bind:open={popoverOpen}>
		<Popover.Trigger>Login</Popover.Trigger>
		<Popover.Content class="w-64">
			<div class="grid gap-4">
				<div class="space-y-2">
					<h4 class="font-medium leading-none">Login Admin</h4>
					<p class="text-sm text-muted-foreground">Masukkan kata kunci admin.</p>
				</div>

				{@render authorizeForm('login')}
			</div>
		</Popover.Content>
	</Popover.Root>
{/if}
