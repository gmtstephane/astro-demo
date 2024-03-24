<script lang="ts">
	import type { Ticketing } from '@db/types';

	import TextForm from './select/Text.svelte';
	import ImageForm from './select/Image.svelte';

	export let defaultValue: Ticketing | null = null;
	let name = defaultValue?.name || '';
	let image = defaultValue?.icon || '';
</script>

<form class="grid grid-cols-6 gap-5 w-full" method="post">
	<TextForm name="name" label="Nom de la billeterie" bind:value={name} />
	<ImageForm name="image" bind:value={image} />

	<div class="col-span-full flex items-center justify-center mt-5">
		<button class="button" type="submit">{defaultValue ? 'Update' : 'Create'}</button>
	</div>
</form>
