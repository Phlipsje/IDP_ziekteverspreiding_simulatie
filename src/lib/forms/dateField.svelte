<script lang="ts">
	export let label: string = 'Start date';
	export let value: string = '';
	export let minDate: string | undefined = undefined;
	export let maxDate: string | undefined = undefined;

	export let onChange: (date: string, isValid: boolean) => void = () => {};

	let isValid = true;

	function handleChange(event: Event) {
		const input = event.target as HTMLInputElement;
		value = input.value;
		isValid = input.checkValidity();
		onChange(value, isValid);
	}
</script>

<div
	class="flex items-center justify-between h-[40px] gap-0 rounded-[5px] border
		{isValid ? 'border-[#A3A3A3] bg-[#EEE]' : 'border-red-500 bg-red-50'}"
>
	<!-- Label -->
	<span class="text-[#4D4D4D] p-4 font-inter text-[14px] font-normal whitespace-nowrap">
		{label}
	</span>

	<!-- Date input -->
	<input
		type="date"
		class="h-full px-2 box-border rounded-[3px]
		bg-white border border-[#A3A3A3]
		text-[#4D4D4D] font-inter text-[14px]
		focus:outline-none focus:ring-2 focus:ring-[#777082]"
		bind:value
		min={minDate}
		max={maxDate}
		on:change={handleChange}
	/>
</div>
