<script lang="ts">
	import { type CreateTicket, type Ticketing } from '@db/types';
	import SelectTicketing from './Ticketing.svelte';
	export let ticketings: Ticketing[];
	export let index = 0;
	export let ticket: CreateTicket;
	export let onRemove: () => void;
	export let UpdateTicket: (index: number, url: string, price: number, ticketingId: number) => void;

	function update() {
		UpdateTicket(index, ticket.url, ticket.price, ticket.ticketingId);
	}
</script>

<div class="ticket col-span-6 grid grid-cols-12 gap-5 mb-1">
	<SelectTicketing onchange={update} bind:value={ticket.ticketingId} {ticketings} />
	<div class="col-span-full sm:col-span-2">
		<label for="price">Price</label>
		<input type="text" placeholder="Price" on:change={update} bind:value={ticket.price} />
	</div>
	<div class="col-span-full sm:col-span-5">
		<label for="url">Url</label>
		<input on:change={update} type="text" placeholder="Url" bind:value={ticket.url} />
	</div>
	<div class="flex items-end w-full">
		<button on:click={onRemove} type="button">Remove</button>
	</div>
</div>

<style>
	input {
		@apply col-span-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 mt-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6;
	}
	button {
		@apply ml-3 inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black;
	}
</style>
