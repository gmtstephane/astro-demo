<script lang="ts">
	import { type Team } from '@db/types';

	// Component props
	export let championship: number;
	export let teams: Team[];
	export let value: number = 0;
	export let name: string = 'team';
	export let label = 'Team';
	let TeamsByChampioniships = teams.filter((team) => team.championships.some((c) => c === championship));
</script>

<div class="col-span-full sm:col-span-3">
	<label for={name}>{label}</label>
	<select {name} bind:value disabled={!championship}>
		<option value={0}>Select a Team</option>
		{#if championship}
			{#each TeamsByChampioniships as team}
				<option value={team.id}>{team.name}</option>
			{/each}
		{/if}
	</select>
</div>
