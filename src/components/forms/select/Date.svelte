<script lang="ts">
	export let value: Date = new Date();

	// Convert the Date object to a local datetime string in the format YYYY-MM-DDTHH:MM
	let datetimeLocalString = value.toISOString().slice(0, 16);

	// Function to check if a date string is valid
	const isValidDate = (dateStr: string): boolean => {
		const date = new Date(dateStr);
		return !isNaN(date.getTime());
	};

	// React to changes in the input and update the original Date object, if the new value is valid.
	$: if (datetimeLocalString !== value.toISOString().slice(0, 16)) {
		if (isValidDate(datetimeLocalString)) {
			// Parse the string back to a Date object, considering browser might not handle timezone correctly.
			value = new Date(datetimeLocalString);
		}
	}
</script>

<div class="col-span-6">
	<label for="date">Date</label>
	<input
		class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 mt-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
		name="date"
		type="datetime-local"
		bind:value={datetimeLocalString}
	/>
</div>
