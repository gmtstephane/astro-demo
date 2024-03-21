<script lang="ts">
	import Header from './Header.svelte';
	import type { Location, Sport, CreateTicket, Ticketing } from '@db/types';
	import SelectSport from './select/Sport.svelte';
	import SelectLocation from './select/Location.svelte';
	import SelectDate from './select/Date.svelte';
	import TextForm from './select/Text.svelte';
	import ImageForm from './select/Image.svelte';
	import TicketManager from './select/TicketManager.svelte';

	// Component props
	export let sports: Sport[];
	export let locations: Location[];
	export let ticketings: Ticketing[];
	// Component props

	let sport: number = 0;
	let name = '';
	let location: number = 0;
	let date = new Date();
</script>

<form class="grid grid-cols-6 gap-5" method="post">
	<Header Title="Evenement" Description="Information sur l'evenement" />
	<TextForm name="name" label="Nom de l'evenement" bind:value={name} />
	<ImageForm name="image" />
	<SelectSport bind:value={sport} {sports} sportType={'Individual'} />
	{#key sport}
		<SelectLocation bind:value={location} {locations} {sport} />
	{/key}
	<SelectDate bind:value={date} />
	<Header Title="Billets" Description="Information sur les billets" />
	<TicketManager {ticketings} />
	<div class="col-span-full flex items-center justify-center mt-5">
		<button type="submit">Create Event</button>
	</div>
</form>
