<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import { LoaderPinwheel } from 'lucide-svelte';
	import prettyBytes from 'pretty-bytes';
	import { superForm, fileProxy, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data, disabled }: { data: { form: SuperValidated<Infer<FormSchema>> }; disabled: boolean } =
		$props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		resetForm: false
	});

	const { form: formData, enhance, delayed } = form;

	const file = fileProxy(form, 'file');
</script>

<form method="POST" enctype="multipart/form-data" use:enhance class="w-full space-y-4">
	<Form.Field {form} name="nama">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Nama</Form.Label>
				<Input {...props} autocomplete="name" bind:value={$formData.nama} {disabled} />
			{/snippet}
		</Form.Control>
		<Form.Description>
			Pengumpulan dengan nama yang sama akan menimpa file sebelumnya.
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="file">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>File (Max 10MB)</Form.Label>
				<div
					class="relative rounded-md border-2 border-dotted border-input px-6 py-4 shadow-sm sm:px-12 sm:py-8"
				>
					<input
						class="absolute inset-0 opacity-0 disabled:cursor-not-allowed"
						{...props}
						type="file"
						bind:files={$file}
						{disabled}
					/>
					{#if $file[0]}
						{@const { name, size } = $file[0]}
						{@const humanSize = prettyBytes(size, { space: false })}
						<p>
							<span class="underline">{name}</span>
							<span class="font-semibold">({humanSize})</span>
						</p>
					{:else}
						<p class="text-center text-lg font-semibold">Pilih file...</p>
					{/if}
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<div class="flex items-center">
		<Form.Button {disabled}>Submit</Form.Button>
		{#if $delayed}
			<LoaderPinwheel class="ml-2 animate-spin" />
		{/if}
	</div>
</form>
