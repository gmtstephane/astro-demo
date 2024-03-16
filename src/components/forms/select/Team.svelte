<script lang="ts">
	import { type TeamType, type TeamWithChampionshipsType } from '@db/queries/sports';

	// Component props
	export let championship: number;
	export let teams: TeamWithChampionshipsType[];
	export let value: number = 0;
	export let name: string = 'team';
	export let label = 'Team';
	let TeamsByChampioniships = teams.filter((team) => team.teamToChampionships.some((c) => c.championshipId === championship));
</script>

<label for={name}>{label}</label>
<select {name} bind:value disabled={!championship}>
	<option value={0}>Select a Team</option>
	{#if championship}
		{#each TeamsByChampioniships as team}
			<option value={team.id}>{team.name}</option>
		{/each}
	{/if}
</select>
