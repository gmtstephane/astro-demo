<script lang="ts">
	import type { EventDescription } from '@db/types';
	import { slide } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { clickOutside } from '../click-outside';

	export let events: EventDescription[];
	let displayEvents: EventDescription[] = events;

	let search: string;
	let pageSize = 10;
	let currentPage = 1;

	$: displayEvents = events
		.filter((event) => {
			if (!search) return true;
			return event.name.toLowerCase().includes(search.toLowerCase());
		})
		.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	function dateFormat(date: Date) {
		return new Date(date).toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	}
	let newOpen = false;
</script>

<div class="px-4 sm:px-6 lg:px-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-base font-semibold leading-6 text-gray-900">Evenements</h1>
			<p class="mt-2 text-sm text-gray-700">Liste des Evenements</p>
		</div>
		<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			<div class="relative inline-block text-left">
				<button
					use:clickOutside
					on:click_outside={() => {
						if (newOpen) newOpen = false;
					}}
					class="button"
					type="button"
					on:click={() => (newOpen = !newOpen)}
					>Nouveau
					<svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path
							fill-rule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
				{#if newOpen}
					<div
						transition:slide={{
							easing: cubicInOut,
							duration: 200,
						}}
						class="
					absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="menu-button"
						tabindex="-1"
					>
						<div class="py-1" role="none">
							<a
								href="/events/new/team"
								class="text-gray-700 block px-4 py-2 text-sm"
								role="menuitem"
								tabindex="-1"
								id="menu-item-0">Equipes</a
							>
							<a
								href="/events/new/player"
								class="text-gray-700 block px-4 py-2 text-sm"
								role="menuitem"
								tabindex="-1"
								id="menu-item-1">Joueur vs Joueur</a
							>
							<a
								href="/events/new/generic"
								class="text-gray-700 block px-4 py-2 text-sm"
								role="menuitem"
								tabindex="-1"
								id="menu-item-1">Generique</a
							>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="mt-8 flow-root">
		<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
				<input type="text" class="input" placeholder="Rechercher" bind:value={search} />

				<table class="min-w-full divide-y divide-gray-300">
					<thead>
						<tr>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Image</th>
							<th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Nom</th>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden xl:table-cell">Lieux</th>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">Sport</th>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell"
								>Championnat</th
							>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden xl:table-cell">Type</th>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">Date</th>
							<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
								<span class="sr-only">Edit</span>
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each displayEvents as event}
							<tr>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
									<img src={event.icon} alt={event.name} class="h-8 aspect-square object-contain" />
								</td>
								<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{event.name}</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden xl:table-cell">{event.location}</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden md:table-cell">{event.sport}</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell">{event.championship}</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden xl:table-cell">{event.type}</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden md:table-cell">{dateFormat(event.date)}</td>
								<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
									<a href={'/events/' + event.id} class="text-black hover:text-slate-800"
										>Edit<span class="sr-only">, Lindsay Walton</span></a
									>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<nav
					class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
					aria-label="Pagination"
				>
					<div class="hidden sm:block">
						<p class="text-sm text-gray-700">
							Showing
							<span class="font-medium">{(currentPage - 1) * pageSize}</span>
							to
							<span class="font-medium">{Math.min((currentPage - 1) * pageSize + pageSize, displayEvents.length)}</span>
							of
							<span class="font-medium">{events.length}</span>
							results
						</p>
					</div>
					<div class="flex flex-1 justify-between sm:justify-end">
						<button
							on:click={() => {
								if (currentPage > 1) currentPage--;
							}}
							class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
							>Previous</button
						>
						<button
							on:click={() => {
								if ((currentPage - 1) * pageSize + pageSize < events.length) currentPage++;
							}}
							class="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
							>Next</button
						>
					</div>
				</nav>
			</div>
		</div>
	</div>
</div>
