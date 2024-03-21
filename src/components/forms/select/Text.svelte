<script lang="ts">
	export let value: string = '';
	export let label: string = '';
	export let name: string = '';
</script>

<div class="col-span-full">
	<label for="price">{label}</label>
	<input type="text" placeholder="Price" bind:value {name} />
</div>

<style>
	input {
		@apply col-span-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 mt-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6;
	}
</style>
