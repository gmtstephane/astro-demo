<script lang="ts">
	let selectedVehicle = '';
	let selectedModel = '';
	const vehicles = ['moto', 'auto', 'boat'];
	const models: { [key: string]: string[] } = {
		moto: ['Model 1', 'Model 2'],
		auto: ['Model A', 'Model B'],
		boat: ['Model X', 'Model Y'],
	};
</script>

<main>
	<p>Selected Vehicle: {selectedVehicle}</p>
	<p>Selected Model: {selectedModel}</p>
	<form method="POST">
		<select name="vehicule" bind:value={selectedVehicle}>
			<option value="">Please select a vehicle</option>
			{#each vehicles as vehicle}
				<option value={vehicle}>{vehicle}</option>
			{/each}
		</select>

		<select bind:value={selectedModel} disabled={!selectedVehicle}>
			<option value="">Please select a model</option>
			{#if selectedVehicle}
				{#each models[selectedVehicle] as model}
					<option value={model}>{model}</option>
				{/each}
			{/if}
		</select>
		<button type="submit">Create</button>
	</form>
</main>
