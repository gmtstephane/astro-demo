<script lang="ts">
	import type { CreateTicket, Ticketing } from '@db/types';
	import NewTicket from './Ticket.svelte';

	export let ticketings: Ticketing[];
	let value = '';

	let tickets: CreateTicket[] = [];
	$: value = JSON.stringify(tickets);

	function addTicket() {
		tickets = [...tickets, { eventId: '', price: '0', ticketingId: 0, url: '' }];
	}

	function removeTicket(index: number) {
		tickets = tickets.filter((_, i) => i !== index);
	}

	function UpdateTicket(index: number, url: string, price: string, ticketingId: number) {
		tickets[index].url = url;
		tickets[index].price = price;
		tickets[index].ticketingId = ticketingId;
	}
</script>

<div class="col-span-6">
	{#each tickets as ticket, index}
		<NewTicket {UpdateTicket} {ticket} onRemove={() => removeTicket(index)} {ticketings} {index} />
	{/each}
	<input name="tickets" bind:value hidden />

	<div class="col-span-full">
		<button type="button" on:click={addTicket}>Add Ticket</button>
	</div>
</div>

<style>
	button {
		@apply flex mt-5 text-center items-center  justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black;
	}
</style>
