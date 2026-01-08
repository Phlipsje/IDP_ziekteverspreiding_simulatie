<script lang="ts">
	import TitleButton from '$lib/forms/titleButton.svelte';
	import TabHeaderButton from '$lib/components/tabHeaderButton.svelte';
	import DateField from '$lib/forms/dateField.svelte';
	import SmallImageButton from '$lib/forms/smallImageButton.svelte';

	import PauseImage from '$lib/assets/pause.png';
	import BackwardImage from '$lib/assets/backward.png';
	import playImage from '$lib/assets/play.png';
	import forwardImage from '$lib/assets/forward.png';
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
						labelBold="Country graph"
						showButton={true}
						buttonText="Change"
						buttonBgColor="#827E9A"
						buttonTextColor="#FFF"
						onButtonClick={() => console.log('Button clicked')}
					/>
				</div>
				<div
					class="flex flex-col items-start w-[398px] h-full p-1 bg-white border rounded-[5px] border-[#A3A3A3]"
				>
					<!-- Here goes country graph code -->
				</div>
			</div>

			<!-- Lower -->
			<div
				class="flex flex-col items-start p-2 gap-2 h-full rounded-[5px] border border-[#A3A3A3] bg-[#EEE]"
			>
				<div class="flex">
					<TabHeaderButton labelNormal="Selected: " labelBold="Utrecht" showButton={false} />
				</div>
				<div
					class="flex flex-col items-start w-[398px] h-full p-1 bg-white border rounded-[5px] border-[#A3A3A3]"
				>
					<!-- Selected municipality data -->
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
				</div>
				<div class="flex flex-col gap-2 h-full">
					<div
						class="flex flex-col h-full items-start p-2 gap-2 rounded-[5px] border border-[#A3A3A3] bg-[#EEE] h-full"
					>
						<div class="flex">
							<TabHeaderButton
								labelNormal="Selected: "
								labelBold="Covid-26"
								showButton={true}
								buttonText="Change"
								buttonBgColor="#827E9A"
								buttonTextColor="#FFF"
								onButtonClick={() => console.log('Button clicked')}
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
								labelNormal="Disease configuration"
								labelBold=""
								showButton={false}
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
