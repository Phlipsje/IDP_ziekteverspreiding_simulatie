<script lang="ts">
	import { getMostRecentStats } from '$lib/simulation/simulationStats';
	// ---- Props ----
	let snapshots: {
		day: number;
		date: Date;
		population: number;
		susceptible: number;
		infected: number;
		recovered: number;
	}[] = [];

	// ---- Config ----
	export let width: number = 600;
	export let height: number = 300;
	export let windowSize: number = 60;
	export let refreshCycle: number = 0;

	let pointsS = "";
	let pointsI = "";
	let pointsR = "";
	let population = 0;
	let susceptible = 0;
	let infected = 0;
	let recovered = 0;

	function toPolylinePoints(focus: string, maxY: number, width: number, height: number): string {
		if (snapshots.length < 2 || maxY <= 0) return "";

		const sliceStart = Math.max(0, snapshots.length - windowSize);
		const visible = snapshots.slice(sliceStart);

		if (visible.length < 2) return "";

		const n = visible.length - 1;

		return visible
			.map((value, i) => {
				let realValue = 0;
				if(focus==="susceptible")
					realValue = value.susceptible;
				if(focus==="infected")
					realValue = value.infected;
				if(focus==="recovered")
					realValue = value.recovered;
				const x = Math.round((i / n) * width);
				const y = Math.round(height - (realValue / maxY) * height);
				return `${x},${y}`;
			})
			.join(" ");
	}


	// ---- Reactive SVG paths ----
	 {

	}
	$: if(refreshCycle) {
		snapshots = getMostRecentStats(60);
		if(snapshots.length > 1)
		{
			pointsS = toPolylinePoints("susceptible", population, width, height);
			pointsI = toPolylinePoints("infected",    population, width, height);
			pointsR = toPolylinePoints("recovered",   population, width, height);
			population = snapshots[snapshots.length - 1].population;
			susceptible = snapshots[snapshots.length - 1].susceptible;
			infected = snapshots[snapshots.length - 1].infected;
			recovered = snapshots[snapshots.length - 1].recovered;
		}
	}
</script>

<div class="p-6 max-w-xl mx-auto">
	<svg
		{width}
		{height}
		class="border border-gray-300 bg-white"
	>
		<!-- Susceptible -->
		<polyline
			fill="none"
			stroke="blue"
			stroke-width="2"
			points={pointsS}
		/>

		<!-- Infected -->
		<polyline
			fill="none"
			stroke="red"
			stroke-width="2"
			points={pointsI}
		/>

		<!-- Recovered -->
		<polyline
			fill="none"
			stroke="green"
			stroke-width="2"
			points={pointsR}
		/>
	</svg>

	<div class="flex gap-4 mt-2 text-sm">
		<span class="text-blue-600">Susceptible</span>
		<span class="text-red-600">Infected</span>
		<span class="text-green-600">Recovered</span>
	</div>

	<p class="mt-4 text-lg">
		Population: {population},
		Susceptible: {susceptible},
		Infected: {infected},
		Recovered: {recovered}
	</p>
</div>
