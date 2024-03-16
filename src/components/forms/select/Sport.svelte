<script lang="ts">
	import { type SportType } from '@db/queries/sports';
	// Component props
	export let sports: SportType[];
	export let value: number = 0;
	// Component props
</script>

<label for="location" class="block text-sm font-medium leading-6 text-gray-900">Location</label>
<select name="sport" bind:value>
	<option value={0}>Select a Sport</option>
	{#each sports as sport}
		<option value={sport.id}>{sport.name}</option>
	{/each}
</select>
