<script lang="ts">
	import TitleButton from '$lib/forms/titleButton.svelte';
	import TabHeaderButton from '$lib/components/tabHeaderButton.svelte';
	import DateField from '$lib/forms/dateField.svelte';
	import SmallImageButton from '$lib/forms/smallImageButton.svelte';

	import PauseImage from '$lib/assets/pause.png';
	import BackwardImage from '$lib/assets/backward.png';
	import playImage from '$lib/assets/play.png';
	import forwardImage from '$lib/assets/forward.png';

	import Map from '$lib/components/map.svelte';
	import SirGraph from '$lib/components/sirGraph.svelte';
	import SelectedMunicipality from '$lib/components/selectedMunicipality.svelte';

	//Simulation
	import { onMount } from "svelte";
	import { load, start, step } from '$lib/simulation/simulation.js';
	import { getStats } from '$lib/simulation/simulationStats';

	//Update and draw loop
	const updateHz = 20;
	const drawHz = 10;

	let updateTimer;
	let drawTimer;

	//Use these in reactive updates to decide when UI components should be redrawn
	let currentUpdateCall = 0;
	let currentDrawCall = 0;

	//Start function
	onMount(() => {
		//Prepare all the simulation data
		load();

		//Run start on model
		start();

		updateTimer = setInterval(update, 1000 / updateHz);
		drawTimer = setInterval(draw, 1000 / drawHz);

		return () => {
			clearInterval(updateTimer);
		};
	});

	const update = () => {
		step();
		currentUpdateCall += 1;
	};

	const draw = () => {
		currentDrawCall += 1;
	}


	import PopUpList from "$lib/components/popUpList.svelte";

	// Disease select
	let showDiseasePopup = false;
	let selectedDisease = { naam: "Covid-26", code: "COVID", type: "Virus" };
	function openDiseasePopup() {showDiseasePopup = true;}
	function closeDiseasePopup() {showDiseasePopup = false;}
	function handleDiseaseSelect(e) {selectedDisease = e.detail;closeDiseasePopup();}

	// Graph select
	let showGraphPopup = false;
	let selectedGraph = { naam: "Nederland", code: "NL", type: "Land" };
	function openGraphPopup() {showGraphPopup = true;}
	function closeGraphPopup() {showGraphPopup = false;}
	function handleGraphSelect(e) {selectedGraph = e.detail;closeGraphPopup();}

	// Muncipality select
	let showMuncipalityPopup = false;
	let selectedMuncipality = { naam: "Nederland", code: "NL", type: "Land" };
	function openMuncipalityPopup() {showMuncipalityPopup = true;}
	function closeMuncipalityPopup() {showMuncipalityPopup = false;}
	function handleMuncipalitySelect(e) {selectedMuncipality = e.detail;closeMuncipalityPopup();}

	// Configuration select
	let showConfigurePopup = false;
	let selectedConfigure = { naam: "Pandemic", snelheid: "0.5", type: "lockdown" };
	function openConfigurePopup() {showConfigurePopup = true;}
	function closeConfigurePopup() {showConfigurePopup = false;}
	function handleConfigureSelect(e) {selectedConfigure = e.detail;closeConfigurePopup();}


	const diseases = [
		{ naam: "Covid-19", code: "COVID", type: "Virus" },
		{ naam: "Ebola", code: "EBOLA", type: "Virus" }
	];

	const graphs = [
		{ naam: "Nederland", code: "NL", type: "Land" },
		{ naam: "Utrecht", code: "GM0344", type: "Gemeente" }
	];

	const municipality = [
		{ naam: "Nederland", code: "NL", type: "Land" },
		{ naam: "Utrecht", code: "GM0344", type: "Gemeente" }
	];

	const configure = [
		{ naam: "Pandemic", snelheid: "0.5", type: "lockdown" },
		{ naam: "Upcoming disease", snelheid: "0.15", type: "lockdown" }
	];

	import { createEventDispatcher } from 'svelte';
	import selectedMunicipality from '$lib/components/selectedMunicipality.svelte';
	const dispatch = createEventDispatcher();
</script>

<div class="flex w-full h-full p-5 flex-col items-start gap-4 h-screen">
	<div class="flex items-center gap-4 self-stretch">
		<img
			src="src\lib\assets\Logo 1.png"
			alt="Description"
			class="w-[70px] h-[60px] object-cover bg-gray-300"
		/>
		<div class="flex items-center gap-4 ml-auto">
			<TitleButton text="Simulation" bgColor="#827E9A" textColor="#FFF" />
			<TitleButton text="Graphs" bgColor="#827E9A" textColor="#FFF" />
			<TitleButton text="Settings" bgColor="#827E9A" textColor="#FFF" />
			<TitleButton text="Sources" bgColor="#827E9A" textColor="#FFF" />
		</div>
	</div>

	<div class="w-full h-px bg-[#A3A3A3]"></div>

	<div class="flex items-start gap-2 self-stretch h-full">
		<!-- Left -->
		<div class="flex flex-col items-start gap-2 h-full">
			<!-- Upper -->
			<div
				class="flex flex-col items-start p-2 gap-2 h-full rounded-[5px] border border-[#A3A3A3] bg-[#EEE]"
			>
				<div class="flex">
					<TabHeaderButton
						labelNormal="Selected: "
						labelBold={selectedGraph.naam}
						showButton={true}
						buttonText="Change"
						buttonBgColor="#827E9A"
						buttonTextColor="#FFF"
						onButtonClick={openGraphPopup}
					/>
				</div>
				<div
					class="flex flex-col items-start w-[398px] h-full p-1 bg-white border rounded-[5px] border-[#A3A3A3]"
				>
					<!-- Here goes country graph code -->
					<SirGraph
						width={300}
						height={250}
						windowSize={60}
						refreshCycle={currentDrawCall}
						/>
				</div>
			</div>

			<!-- Lower -->
			<div
				class="flex flex-col items-start p-2 gap-2 h-full rounded-[5px] border border-[#A3A3A3] bg-[#EEE]"
			>
				<div class="flex">
						<TabHeaderButton
							labelNormal="Selected: "
							labelBold={selectedMuncipality.naam}
							showButton={true}
							buttonText="Change"
							buttonBgColor="#827E9A"
							buttonTextColor="#FFF"
							onButtonClick={openMuncipalityPopup}
						/>
					</div>
				<div
					class="flex flex-col items-start w-[398px] h-full p-1 bg-white border rounded-[5px] border-[#A3A3A3]"
				>
					<!-- Selected municipality data -->
					<SelectedMunicipality municipality={selectedMuncipality.code} />
				</div>
			</div>
		</div>

		<!-- Right -->
		<div class="flex flex-col items-start gap-2 flex-1 h-full">
			<div class="flex items-start gap-2 self-stretch h-full">
				<div
					class="flex h-[600px] flex-col items-start flex-1 border rounded-[5px] border-[#A3A3A3] bg-[#EEE] h-full"
				>
					<!-- Netherlands visualization -->
					<Map
						width={750}
						height={500}
						refreshCycle={currentDrawCall}
					/>
				</div>
				<div class="flex flex-col gap-2 h-full">
					<div
						class="flex flex-col h-full items-start p-2 gap-2 rounded-[5px] border border-[#A3A3A3] bg-[#EEE] h-full"
					>
					<div class="flex">
							<TabHeaderButton
								labelNormal="Selected: "
								labelBold={selectedDisease.naam}
								showButton={true}
								buttonText="Change"
								buttonBgColor="#827E9A"
								buttonTextColor="#FFF"
								onButtonClick={openDiseasePopup}
							/>
						</div>

						
						<div
							class="flex flex-col items-start w-[398px] self-stretch p-1 bg-white border rounded-[5px] border-[#A3A3A3] h-full"
						>
							<!-- Here goes disease configuration code -->
						</div>
					</div>
					<div
						class="flex flex-col h-full items-start p-2 gap-2 rounded-[5px] border border-[#A3A3A3] bg-[#EEE] h-full"
					>
					<div class="flex">
							<TabHeaderButton
								labelNormal="Selected: "
								labelBold={selectedConfigure.naam}
								showButton={true}
								buttonText="Change"
								buttonBgColor="#827E9A"
								buttonTextColor="#FFF"
								onButtonClick={openConfigurePopup}
							/>
						</div>
						<div
							class="flex flex-col items-start h-full w-[398px] self-stretch p-1 bg-white border rounded-[5px] border-[#A3A3A3]"
						>
							<!-- Here goes disease configuration code -->
						</div>
					</div>
				</div>
			</div>

			<!-- Timeline frame -->
			<div
				class="flex h-[240px] p-2 flex-col items-start self-stretch gap-2 border rounded-[5px] border-[#A3A3A3] bg-[#EEE]"
			>
				<!-- Timeline control -->
				<div class="flex items-center gap-2">
					<DateField
						label="Start date"
						value="2024-01-01"
						minDate="2020-01-01"
						maxDate="2030-12-31"
						onChange={(date, valid) => {
							console.log('Date:', date);
							console.log('Valid:', valid);
						}}
					/>

					<DateField
						label="End date"
						value="2027-01-01"
						minDate="2020-01-01"
						maxDate="2030-12-31"
						onChange={(date, valid) => {
							console.log('Date:', date);
							console.log('Valid:', valid);
						}}
					/>

					<!-- Buttons -->
					<div class="flex flex-row">
						<SmallImageButton
							src={BackwardImage}
							alt="Go backwards"
							onClick={() => console.log('clicked')}
						/>

						<SmallImageButton
							src={PauseImage}
							alt="Pause simulation"
							onClick={() => console.log('clicked')}
						/>

						<SmallImageButton
							src={playImage}
							alt="Play simulation"
							onClick={() => console.log('clicked')}
						/>

						<SmallImageButton
							src={forwardImage}
							alt="Go forwards"
							onClick={() => console.log('clicked')}
						/>
					</div>
				</div>

				<!-- Timeline -->
				<div
					class="flex items-start flex-1 self-stretch border rounded-[3px] border-[#8F93BF] bg-[#FFF]"
				></div>
			</div>
		</div>
	</div>
</div>

{#if showDiseasePopup}
	<div class="fixed inset-0 z-[9999]">
		<div class="absolute inset-0 bg-black/40"></div>

		<div class="absolute inset-0 flex items-center justify-center">
			<PopUpList
				entries={diseases}
				on:close={closeDiseasePopup}
				on:select={handleDiseaseSelect}
			/>
		</div>
	</div>
{/if}

{#if showGraphPopup}
	<div class="fixed inset-0 z-[9999]">
		<div class="absolute inset-0 bg-black/40"></div>

		<div class="absolute inset-0 flex items-center justify-center">
			<PopUpList
				entries={graphs}
				on:close={closeGraphPopup}
				on:select={handleGraphSelect}
			/>
		</div>
	</div>
{/if}

{#if showMuncipalityPopup}
	<div class="fixed inset-0 z-[9999]">
		<div class="absolute inset-0 bg-black/40"></div>

		<div class="absolute inset-0 flex items-center justify-center">
			<PopUpList
				entries={municipality}
				on:close={closeMuncipalityPopup}
				on:select={handleMuncipalitySelect}
			/>
		</div>
	</div>
{/if}

{#if showConfigurePopup}
	<div class="fixed inset-0 z-[9999]">
		<div class="absolute inset-0 bg-black/40"></div>

		<div class="absolute inset-0 flex items-center justify-center">
			<PopUpList
				entries={configure}
				on:close={closeConfigurePopup}
				on:select={handleConfigureSelect}
			/>
		</div>
	</div>
{/if}

