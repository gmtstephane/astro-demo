<script lang="ts">
	import { type Ticketing } from '@db/queries/types';
	export let ticketings: Ticketing[];
	export let value: number = 0;
	export let onchange: () => void;
</script>

<div class="col-span-2">
	<label for="location">Billeterie</label>
	<select bind:value on:change={onchange}>
		<option value={0}>Select a Ticketing</option>
		{#each ticketings as ticketing}
			<option value={ticketing.id}>{ticketing.name}</option>
		{/each}
	</select>
</div>
