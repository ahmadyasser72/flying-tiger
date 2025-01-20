<script lang="ts">
	import { goto } from '$app/navigation';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Popover from '$lib/components/ui/popover';
	import { Textarea } from '$lib/components/ui/textarea';
	import { cn, dateFormatter } from '$lib/utils';
	import { formSchema, type FormSchema } from '.';
	import { getLocalTimeZone, type DateValue, today } from '@internationalized/date';
	import { CalendarIcon, LoaderPinwheel } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		onUpdate: ({ form, result }) => {
			if (form.valid) {
				toast.success(
					isEdit
						? `Pengumpulan #${$formData.id} berhasil diperbarui!`
						: 'Pengumpulan berhasil dibuat!',
					{
						duration: 2000,
						onAutoClose: () => goto(result.data.redirectTo)
					}
				);
			}
		}
	});

	const { form: formData, enhance, delayed } = form;

	const isEdit = $derived($formData.id !== undefined);
	const batasWaktu = $derived($formData.batasWaktu);
	let placeholder = $state<DateValue>(today(getLocalTimeZone()));
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
				<Form.Label>Batas waktu</Form.Label>
				<Popover.Root>
					<Popover.Trigger
						{...props}
						class={cn(
							buttonVariants({ variant: 'outline' }),
							'justify-start pl-4 text-left font-normal',
							!batasWaktu && 'text-muted-foreground'
						)}
					>
						{batasWaktu ? dateFormatter.format(batasWaktu) : 'Pilih tanggal'}
						<CalendarIcon class="ml-auto size-4 opacity-50" />
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" side="top">
						<Calendar
							type="single"
							bind:placeholder
							minValue={today(getLocalTimeZone())}
							onValueChange={(v) => {
								if (v) {
									$formData.batasWaktu = v.toDate(getLocalTimeZone());
								} else {
									$formData.batasWaktu = new Date();
								}
							}}
						/>
					</Popover.Content>
				</Popover.Root>
				<Form.Description>Batas waktu mengumpulkan akan diset pada jam 23:59.</Form.Description>
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
