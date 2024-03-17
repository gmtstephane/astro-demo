<script lang="ts">
	import type { ChampionshipType, LocationType, SportType, TeamType, TeamWithChampionshipsType } from '@db/queries/sports';
	import Sport from './select/Sport.svelte';
	import Championship from './select/Championship.svelte';
	import Team from './select/Team.svelte';
	import Location from './select/Location.svelte';
	import DateSelect from './select/Date.svelte';

	export let sports: SportType[];
	export let championships: ChampionshipType[];
	export let teams: TeamWithChampionshipsType[];
	export let locations: LocationType[];
	// Component props

	let sport: number = 0;
	let homeTeam: number = 0;
	let awayTeam: number = 0;
	let championship: number = 0;
	let location: number = 0;
	let date = new Date();

	$: selectedHomeTeam = teams.find((team) => team.id === homeTeam);
</script>

<form class="flex flex-col space-y-4">
	<Sport bind:value={sport} {sports} />
	{#key sport}
		<Championship bind:value={championship} selectedSport={sport} {championships} />
	{/key}
	{#key championship}
		<Team name="homeTeam" label={'Equipe domicile'} bind:value={homeTeam} {championship} {teams} />
		<Team name="awayTeam" label={'Equipe exterieur'} bind:value={awayTeam} {championship} {teams} />
	{/key}
	{#key selectedHomeTeam}
		<Location bind:value={location} {locations} {selectedHomeTeam} />
	{/key}
	<DateSelect bind:value={date} />
</form>

<!-- <div class="mt-10"></div>
<p>Selected Sport: {sport}</p>
<p>Selected Championship: {championship}</p>
<p>Selected HomeTeam: {homeTeam}</p>
<p>Selected AwayTeam: {awayTeam}</p>
<p>Selected Location: {location}</p>
<p>Selected Date: {date}</p> -->
