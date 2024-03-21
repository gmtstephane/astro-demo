<script lang="ts">
	import { type Sport } from '@db/queries/types';
	import { type SportType } from '@db/schema';

	// Component props
	export let sports: Sport[];
	export let value: number = 0;
	export let sportType: SportType | undefined = undefined;
	// Component props

	if (sportType) {
		sports = sports.filter((sport) => sport.type === sportType);
	}
</script>

<div class="col-span-3">
	<label for="location" class="block text-sm font-medium leading-6 text-gray-900">Sport</label>
	<select name="sport" bind:value>
		<option value={0}>Select a Sport</option>
		{#each sports as sport}
			<option value={sport.id}>{sport.name}</option>
		{/each}
	</select>
</div>
