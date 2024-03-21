<script lang="ts">
	import Header from './Header.svelte';
	import type { Championship, Location, Sport, Ticketing, Team, EventTeam, CreateTicket } from '@db/types';
	import SelectSport from './select/Sport.svelte';
	import SelectChampionship from './select/Championship.svelte';
	import SelectTeam from './select/Team.svelte';
	import SelectLocation from './select/Location.svelte';
	import SelectDate from './select/Date.svelte';
	import TicketManager from './select/TicketManager.svelte';

	// Component props
	export let sports: Sport[];
	export let championships: Championship[];
	export let teams: Team[];
	export let locations: Location[];
	export let ticketings: Ticketing[];

	export let defaultValues: EventTeam | null = null;
	export let tickets: CreateTicket[] = [];
	// Component props

	let sport: number = defaultValues?.sportId || 0;
	let homeTeam: number = defaultValues?.homeTeamId || 0;
	let awayTeam: number = defaultValues?.awayTeamId || 0;
	let championship: number = defaultValues?.championshipId || 0;
	let location: number = defaultValues?.locationId || 0;
	let date = defaultValues?.eventDate ? defaultValues.eventDate : new Date();

	$: selectedHomeTeam = teams.find((team) => team.id === homeTeam);
</script>

<form class="grid grid-cols-6 gap-5" method="post">
	<Header Title="Evenement" Description="Information sur l'evenement" />
	<SelectSport bind:value={sport} {sports} sportType={'Team'} />
	{#key sport}
		<SelectChampionship bind:value={championship} selectedSport={sport} {championships} />
	{/key}
	{#key championship}
		<SelectTeam name="homeTeam" label={'Equipe domicile'} bind:value={homeTeam} {championship} {teams} />
		<SelectTeam name="awayTeam" label={'Equipe exterieur'} bind:value={awayTeam} {championship} {teams} />
	{/key}
	{#key sport}
		{#key selectedHomeTeam}
			<SelectLocation bind:value={location} {locations} {selectedHomeTeam} {sport} />
		{/key}
	{/key}
	<SelectDate bind:value={date} />
	<Header Title="Billets" Description="Information sur les billets" />
	<TicketManager {ticketings} {tickets} />

	<div class="col-span-full flex items-center justify-center mt-10">
		<button class="button" type="submit">Create Event</button>
	</div>
</form>
