<script lang="ts">
	import { type LocationType, type TeamType } from '@db/queries/sports';

	// Component props
	export let selectedHomeTeam: TeamType | undefined;
	export let locations: LocationType[];
	export let value: number = 0;
	// Component props

	$: value = locations.find((location) => location.id === selectedHomeTeam?.locationId)?.id || 0;
</script>

<label for="location">Location</label>
<select name="location" bind:value>
	<option value={0}>Select a Location</option>
	{#if selectedHomeTeam}
		{#each locations as location}
			<option value={location.id}>{location.name}</option>
		{/each}
	{/if}
</select>
