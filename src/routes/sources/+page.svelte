<script>
	// Import PDFs as URLs
	import sirPaper from '$lib/assets/sources/Theoretical_concept_model_IDP.pdf';
	import TitleButton from '$lib/forms/titleButton.svelte';

	const pdfLinks = [
		{
			title: "Spatial SIR Modeling",
			url: sirPaper
		},
	];
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

	<!-- PDF Section -->
	<section>
		<h2 class="text-xl font-semibold mb-3">Theory</h2>
		<ul class="list-disc ml-6 space-y-2">
			{#each pdfLinks as paper}
				<li>
					<a
						href={paper.url}
						target="_blank"
						class="text-blue-600 underline"
					>
						{paper.title}
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<!-- Written References Section -->
	<section>
		<h2 class="text-xl font-semibold mb-3">References</h2>

		<ul class="space-y-4">
			<li>
				<strong>Example reference</strong> — Bla bla text
			</li>
		</ul>
	</section>
</div>