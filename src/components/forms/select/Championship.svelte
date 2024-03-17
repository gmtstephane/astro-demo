<script lang="ts">
	import { type ChampionshipType } from '@db/queries/sports';

	// Component props
	export let selectedSport: number;
	export let championships: ChampionshipType[];
	export let value: number = 0;

	$: ChampionshipsBySport = championships.filter((championship) => championship.sportId === selectedSport);
</script>

<label for="sport">Championship</label>
<select name="sport" bind:value disabled={!selectedSport}>
	<option value={0}>Select a Championship</option>
	{#if selectedSport}
		{#each ChampionshipsBySport as championship}
			<option value={championship.id}>{championship.name}</option>
		{/each}
	{/if}
</select>
