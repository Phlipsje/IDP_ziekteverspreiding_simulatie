<script lang="ts">
	export let src: string;
	export let alt: string = '';
	export let size: number = 40;
	export let onClick: () => void = () => {};
</script>

<button
	type="button"
	class="flex items-center justify-center bg-transparent p-0
		rounded-[6px] transition-colors duration-150
		hover:bg-black/5 active:bg-black/10"
	style="width: {size}px; height: {size}px;"
	on:click={onClick}
>
	<img {src} {alt} class="w-[32px] h-[32px] object-contain pointer-events-none" />
</button>
