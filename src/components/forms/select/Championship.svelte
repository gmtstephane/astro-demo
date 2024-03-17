<script lang="ts">
	import { type Championship } from '@db/queries/types';

	// Component props
	export let selectedSport: number;
	export let championships: Championship[];
	export let value: number = 0;

	$: ChampionshipsBySport = championships.filter((championship) => championship.sportId === selectedSport);
</script>

<div class="col-span-3">
	<label for="championship">Championship</label>
	<select name="championship" bind:value disabled={!selectedSport}>
		<option value={0}>Select a Championship</option>
		{#if selectedSport}
			{#each ChampionshipsBySport as championship}
				<option value={championship.id}>{championship.name}</option>
			{/each}
		{/if}
	</select>
</div>
