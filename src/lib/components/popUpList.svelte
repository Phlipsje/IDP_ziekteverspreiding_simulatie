<script lang="ts">
	import AdjustButton from "$lib/forms/AdjustButton.svelte";
	import TitleButton from "$lib/forms/TitleButton.svelte";
	import { createEventDispatcher } from "svelte";

	export type Entry = {
		naam: string;
		code: string; //Code represents internal data to know what we are selecting (like municipality code for example)
		type: string;
	};

	export let entries: Entry[] = [];

	const dispatch = createEventDispatcher<{
		select: Entry;
		close: void;
	}>();
</script>

<div class="flex flex-col bg-[#AAA] rounded-[10px] w-[720px] h-[480px]">
	<div class="flex flex-col bg-[#F8F8F8] p-4 rounded-[10px] gap-4 h-full">
		<div class="text-[#444] font-spaceGrotesk text-[18px] font-semibold">
			Selecteer ziekte
		</div>

		<div class="flex flex-col overflow-y-auto">
			<!-- Header -->
			<div class="flex justify-between bg-[#E0E0E0] rounded-t px-3 py-2 sticky top-0 z-10">
				<div class="font-bold w-1/5">Naam</div>
				<div class="font-bold w-1/5">Type</div>
				<div class="font-bold w-1/5">Selecteer</div>
			</div>

			<!-- Rows -->
			{#each entries as entry}
				<div class="flex justify-between even:bg-[#FFF] bg-[#F0F0F0] px-3 py-2">
					<div class="w-1/5">{entry.naam}</div>
					<div class="w-1/5">{entry.type}</div>
					<div class="w-1/5">
						<AdjustButton
							text="Selecteer"
							bgColor="#827E9A"
							textColor="#FFF"
							on:click={() => dispatch("select", entry)}
						/>
					</div>
				</div>
			{/each}
		</div>

		<!-- <TitleButton
			text="Annuleren"
			bgColor="#AAA"
			textColor="#FFF"
			on:click={() => dispatch("close")}
		/> -->
	</div>
</div>
