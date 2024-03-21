<script lang="ts">
	import { type Location, type Team } from '@db/types';

	// Component props
	export let selectedHomeTeam: Team | undefined = undefined;
	export let sport: number | undefined = undefined;
	export let locations: Location[];
	export let value: number = 0;

	if (sport) {
		locations = locations.filter((location) => location.commonSports?.some((s) => s === sport));
	}

	if (selectedHomeTeam) {
		value = locations.find((location) => location.id === selectedHomeTeam?.locationId)?.id || 0;
	}
</script>

<div class="col-span-6">
	<label for="location">Location</label>
	<select name="location" bind:value>
		<option value={0}>Select a Location</option>
		{#each locations as location}
			<option value={location.id}>{location.name}</option>
		{/each}
	</select>
</div>
