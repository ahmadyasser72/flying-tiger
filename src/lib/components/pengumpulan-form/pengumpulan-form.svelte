<script lang="ts">
	import { DateTimePicker } from '$lib/components/ui/date-time-picker';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { formSchema, type FormSchema } from '.';
	import { getLocalTimeZone, now, parseAbsoluteToLocal } from '@internationalized/date';
	import { LoaderPinwheel } from 'lucide-svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance, delayed } = form;

	const isEdit = $derived($formData.id !== undefined);
	const batasWaktuPlaceholder = $derived(
		$formData.batasWaktu
			? parseAbsoluteToLocal($formData.batasWaktu.toISOString())
			: now(getLocalTimeZone())
	);
</script>

<form method="POST" use:enhance class="w-full space-y-4">
	{#if isEdit}
		<input type="hidden" name="id" value={$formData.id} />
	{/if}

	<Form.Field {form} name="slug">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Link Pengumpulan</Form.Label>
				<div class="flex items-center">
					<div class="mr-2 font-mono">/p/</div>
					<Input {...props} bind:value={$formData.slug} />
				</div>
			{/snippet}
		</Form.Control>
		<Form.Description>Link untuk mengakses pengumpulan ini.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="judul">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Judul</Form.Label>
				<Input {...props} bind:value={$formData.judul} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="deskripsi">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Deskripsi</Form.Label>
				<Textarea {...props} class="resize-none" bind:value={$formData.deskripsi} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="batasWaktu" class="flex flex-col">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Batas Waktu</Form.Label>
				<DateTimePicker
					date={batasWaktuPlaceholder}
					setDate={(v) => {
						$formData.batasWaktu = v?.toDate(getLocalTimeZone()) ?? new Date();
					}}
				/>
				<Form.Description>Pengumpulan akan ditutup bila melewati batas waktu.</Form.Description>
				<Form.FieldErrors />
				<input hidden value={$formData.batasWaktu} name={props.name} />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<div class="flex items-center">
		<Form.Button>Submit</Form.Button>
		{#if $delayed}
			<LoaderPinwheel class="ml-2 animate-spin" />
		{/if}
	</div>
</form>
