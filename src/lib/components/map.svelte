<script lang="ts">
	import { onMount } from 'svelte';
	import { getMunicipalityCentroid } from '$lib/simulation/simulation.js';
	import { getMunicipalities } from '$lib/simulation/simulationData.js';

	/* =====================
	   Public component API
	   ===================== */

	export let width: number = 600;
	export let height: number = 400;
	export let refreshCycle: number = 0;

	/* =====================
	   Canvas & drawing state
	   ===================== */

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let mapImage: HTMLImageElement;

	const rect = { x: 0, y: 0, width, height };

	/* =====================
	   Netherlands geometry
	   ===================== */

	const NL_MIN_X = 0;
	const NL_MIN_Y = 284182;
	const NL_MAX_X = 466602;
	const NL_MAX_Y = 637049;

	const NL_width = NL_MAX_X - NL_MIN_X;
	const NL_height = NL_MAX_Y - NL_MIN_Y;

	/* =====================
	   Lifecycle
	   ===================== */

	onMount(async () => {
		ctx = canvas.getContext('2d')!;
		await drawNL();
	});

	//Redrawing
	$: if (ctx && mapImage && refreshCycle) {
		redraw();
	}

	function redraw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBaseMap();
		drawMunicipalityCircles(3);
	}


	/* =====================
	   Drawing
	   ===================== */

	async function drawNL() {
		mapImage = new Image();
		mapImage.src = 'src/lib/assets/Kaart nederland.png';
		await mapImage.decode();

		clear();
		drawBaseMap();
		drawMunicipalityCircles(3);
	}

	function clear() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	function drawBaseMap() {
		ctx.drawImage(mapImage, rect.x, rect.y, rect.width, rect.height);
	}

	function metersToCanvas(xMeters: number, yMeters: number) {
		const base_x_offset = 165;

		const scaleX = rect.width / NL_width;
		const scaleY = rect.height / NL_height;
		const scale = Math.min(scaleX, scaleY);

		return {
			x: rect.x + base_x_offset + (xMeters - NL_MIN_X) * scale,
			y: rect.y + (NL_MAX_Y - yMeters) * scale
		};
	}

	/* =====================
	   Color mapping
	   ===================== */

	function valueToColor(value: number) {
		const v = Math.max(0, Math.min(1, value));

		const COLOR_STOPS = [
			{ v: 0.00, r: 0,   g: 176, b: 80  },
			{ v: 0.10, r: 255, g: 235, b: 59  },
			{ v: 0.25, r: 244, g: 67,  b: 54  },
			{ v: 0.40, r: 183, g: 28,  b: 28  }
		];

		for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
			const a = COLOR_STOPS[i];
			const b = COLOR_STOPS[i + 1];

			if (v >= a.v && v <= b.v) {
				const t = (v - a.v) / (b.v - a.v);
				const r = Math.round(a.r + (b.r - a.r) * t);
				const g = Math.round(a.g + (b.g - a.g) * t);
				const bcol = Math.round(a.b + (b.b - a.b) * t);
				return `rgb(${r}, ${g}, ${bcol})`;
			}
		}

		const last = COLOR_STOPS[COLOR_STOPS.length - 1];
		return `rgb(${last.r}, ${last.g}, ${last.b})`;
	}

	/* =====================
	   Municipality drawing
	   ===================== */

	function drawMunicipalityCircles(radius = 3) {
		ctx.save();

		const municipalityList = getMunicipalities();

		for (const municipality of municipalityList) {
			const centroid = getMunicipalityCentroid(municipality.gemeenteCode);
			const { x, y } = metersToCanvas(centroid.x, centroid.y);

			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);
			ctx.fillStyle = valueToColor(
				municipality.infected / municipality.population
			);
			ctx.fill();
		}

		ctx.restore();
	}
</script>

<canvas
	bind:this={canvas}
	width={width}
	height={height}
	>
</canvas>
