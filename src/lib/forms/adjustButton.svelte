<script lang="ts">
	export let text: string = 'Button';
	export let onClick: () => void = () => {};

	export let bgColor: string = '#777082';
	export let textColor: string = '#FFFFFF';

	let overlayOpacity = 0;
	const hoverOpacity = 0.2;
	const activeOpacity = 0.5;
</script>

<button
	class="relative flex justify-center items-center gap-0 h-[24px] px-2 py-1 border border-[#9D9BA5] rounded-[5px] font-inter font-normal text-[18px] leading-normal text-center overflow-hidden transition-colors duration-150"
	style="background: {bgColor}; color: {textColor};"
	on:click={onClick}
	on:mouseenter={() => (overlayOpacity = hoverOpacity)}
	on:mouseleave={() => (overlayOpacity = 0)}
	on:mousedown={() => (overlayOpacity = activeOpacity)}
	on:mouseup={() => (overlayOpacity = hoverOpacity)}
>
	{text}

	<div
		class="absolute inset-0 bg-black pointer-events-none transition-opacity duration-150"
		style="opacity: {overlayOpacity}"
	></div>
</button>
