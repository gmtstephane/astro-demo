<script lang="ts">
	import Header from './Header.svelte';
	import type { Location, Sport, Ticketing, EventGeneric, CreateTicket } from '@db/types';
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

	export let defaultValues: EventGeneric | null = null;
	export let tickets: CreateTicket[] = [];
	// Component props

	let sport: number = defaultValues?.sportId || 0;
	let name = defaultValues?.name || '';
	let location: number = defaultValues?.locationId || 0;
	let date = defaultValues?.eventDate ? defaultValues.eventDate : new Date();
</script>

<form class="grid grid-cols-6 gap-5 w-full" method="post">
	<Header Title="Evenement" Description="Information sur l'evenement" />
	<TextForm name="name" label="Nom de l'evenement" bind:value={name} />
	<ImageForm value={defaultValues?.icon} name="image" />
	<SelectSport bind:value={sport} {sports} sportType={'Individual'} />
	{#key sport}
		<SelectLocation bind:value={location} {locations} {sport} />
	{/key}
	<SelectDate bind:value={date} />
	<Header Title="Billets" Description="Information sur les billets" />
	<TicketManager {ticketings} {tickets} />
	<div class="col-span-full flex items-center justify-center mt-5">
		<button class="button" type="submit">{defaultValues ? 'Update' : 'Create'}</button>
	</div>
</form>
