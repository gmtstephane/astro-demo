<script lang="ts">
	export let value: string = '';
	export let name: string = '';
</script>

<div class="col-span-full grid grid-cols-12 gap-5">
	<div class="col-span-8">
		<label for="image">Image</label>
		<input type="url" placeholder="Url" bind:value {name} />
	</div>
	<div class="col-span-4 flex flex-col items-baseline justify-end">
		{#if value != ''}
			<img loading="eager" src={value} alt="" class="h-10 aspect-square" />
		{/if}
	</div>
</div>

<style>
	input {
		@apply col-span-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 mt-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6;
	}
</style>
