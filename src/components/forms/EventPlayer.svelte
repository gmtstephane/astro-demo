<script lang="ts">
	import Header from './Header.svelte';
	import type { Championship, Location, Sport, Ticketing, Player } from '@db/types';
	import SelectSport from './select/Sport.svelte';
	import SelectChampionship from './select/Championship.svelte';
	import SelectPlayer from './select/Player.svelte';
	import SelectLocation from './select/Location.svelte';
	import SelectDate from './select/Date.svelte';
	import TicketManager from './select/TicketManager.svelte';

	// Component props
	export let sports: Sport[];
	export let championships: Championship[];
	export let players: Player[];
	export let locations: Location[];
	export let ticketings: Ticketing[];
	// Component props

	let sport: number = 0;
	let homeTeam: number = 0;
	let awayTeam: number = 0;
	let championship: number = 0;
	let location: number = 0;
	let date = new Date();
</script>

<form class="grid grid-cols-6 gap-5" method="post">
	<Header Title="Evenement" Description="Information sur l'evenement" />
	<SelectSport bind:value={sport} {sports} sportType={'Individual'} />
	{#key sport}
		<SelectChampionship bind:value={championship} selectedSport={sport} {championships} />
	{/key}
	{#key championship}
		<SelectPlayer name="player1" label={'Joueur 1'} bind:value={homeTeam} {sport} {players} />
		<SelectPlayer name="player2" label={'Joueur 2'} bind:value={awayTeam} {sport} {players} />
	{/key}
	{#key sport}
		<SelectLocation bind:value={location} {locations} {sport} />
	{/key}

	<SelectDate bind:value={date} />
	<Header Title="Billets" Description="Information sur les billets" />
	<TicketManager {ticketings} />

	<div class="col-span-full flex items-center justify-center mt-10">
		<button type="submit">Create Event</button>
	</div>
</form>

<style>
	button {
		@apply flex  text-center items-center  justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black;
	}
</style>
