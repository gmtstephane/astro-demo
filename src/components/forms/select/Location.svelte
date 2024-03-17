<script lang="ts">
	import { type Location, type TeamType } from '@db/queries/types';

	// Component props
	export let selectedHomeTeam: TeamType | undefined;
	export let locations: Location[];
	export let value: number = 0;
	// Component props

	$: value = locations.find((location) => location.id === selectedHomeTeam?.locationId)?.id || 0;
</script>

<div class="col-span-6">
	<label for="location">Location</label>
	<select name="location" bind:value>
		<option value={0}>Select a Location</option>
		{#if selectedHomeTeam}
			{#each locations as location}
				<option value={location.id}>{location.name}</option>
			{/each}
		{/if}
	</select>
</div>
