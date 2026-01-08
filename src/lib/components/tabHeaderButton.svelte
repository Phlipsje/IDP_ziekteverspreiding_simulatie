<script lang="ts">
	import AdjustButton from '$lib/forms/adjustButton.svelte';

	export let labelNormal: string = 'Selected: ';
	export let labelBold: string = 'Country graph';
	export let showButton: boolean = true; // toggle button visibility
	export let buttonText: string = 'Change';
	export let buttonBgColor: string = '#777082';
	export let buttonTextColor: string = '#FFF';
	export let onButtonClick: () => void = () => {};
</script>

<div class="flex items-start gap-3 items-stretch h-full">
	<!-- Label -->
	<div class="flex justify-center items-center h-full">
		<p class="text-[#4D4D4D] text-center font-inter text-[16px] leading-normal">
			<span class="font-normal">{labelNormal}</span>
			<span class="font-bold">{labelBold}</span>
		</p>
	</div>

	<!-- Optional Button -->
	{#if showButton}
		<AdjustButton
			text={buttonText}
			bgColor={buttonBgColor}
			textColor={buttonTextColor}
			onClick={onButtonClick}
		/>
	{/if}
</div>
