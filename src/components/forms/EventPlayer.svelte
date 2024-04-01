<script lang="ts">
	import Header from "./Header.svelte";
	import type {
		Championship,
		Location,
		Sport,
		Ticketing,
		Player,
		CreateTicket,
		FullEventPlayer,
	} from "@db/types";
	import SelectSport from "./select/Sport.svelte";
	import SelectChampionship from "./select/Championship.svelte";
	import SelectPlayer from "./select/Player.svelte";
	import SelectLocation from "./select/Location.svelte";
	import SelectDate from "./select/Date.svelte";
	import TicketManager from "./select/TicketManager.svelte";

	// Component props
	export let sports: Sport[];
	export let championships: Championship[];
	export let players: Player[];
	export let locations: Location[];
	export let ticketings: Ticketing[];

	export let defaultValues: FullEventPlayer | null = null;
	export let tickets: CreateTicket[] = [];
	// Component props

	let sport: number = defaultValues?.sportId || 0;
	let homeTeam: number = defaultValues?.player1.id || 0;
	let awayTeam: number = defaultValues?.player2.id || 0;
	let championship: number = defaultValues?.championshipId || 0;
	let location: number = defaultValues?.locationId || 0;
	let date = defaultValues?.eventDate ? defaultValues.eventDate : new Date();
	console.log;
</script>

<form class="grid grid-cols-6 gap-5" method="post">
	<Header Title="Evenement" Description="Information sur l'evenement" />
	<SelectSport bind:value={sport} {sports} sportType={"Individual"} />
	{#key sport}
		<SelectChampionship
			bind:value={championship}
			selectedSport={sport}
			{championships}
		/>
	{/key}
	{#key championship}
		<SelectPlayer
			name="player1"
			label={"Joueur 1"}
			bind:value={homeTeam}
			{sport}
			{players}
		/>
		<SelectPlayer
			name="player2"
			label={"Joueur 2"}
			bind:value={awayTeam}
			{sport}
			{players}
		/>
	{/key}
	{#key sport}
		<SelectLocation bind:value={location} {locations} {sport} />
	{/key}

	<SelectDate bind:value={date} />
	<Header Title="Billets" Description="Information sur les billets" />
	<TicketManager {ticketings} {tickets} />

	<div class="col-span-full flex items-center justify-center mt-10">
		<button class="button" type="submit"
			>{defaultValues ? "Update" : "Create"}</button
		>
	</div>
</form>
