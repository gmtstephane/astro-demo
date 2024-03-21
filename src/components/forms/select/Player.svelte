<script lang="ts">
	import { type Player, type Team } from '@db/types';

	// Component props
	export let sport: number;
	export let players: Player[];
	export let value: number = 0;
	export let name: string = 'player';
	export let label = 'Player';
	let PlayersBySport = players.filter((p) => p.sportId === sport);
</script>

<div class="col-span-full sm:col-span-3">
	<label for={name}>{label}</label>
	<select {name} bind:value disabled={!sport}>
		<option value={0}>Select a Team</option>
		{#if sport}
			{#each PlayersBySport as p}
				<option value={p.id}>{p.name}</option>
			{/each}
		{/if}
	</select>
</div>
