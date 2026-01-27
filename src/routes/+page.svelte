<script>
    import { onMount, onDestroy } from "svelte";
    import { load, start, step,
             getMunicipalityCentroid, getMunicipalityBbox,
             getTotalPopulation, getTotalSusceptible, getTotalInfected, getTotalRecovered
    } from '../lib/simulation/simulation.js';
    import { getMunicipalityData, getMunicipalities } from '$lib/simulation/simulationData.js';

    //Update and draw loop
    const updateHz = 30;
    const drawHz = 20;

    let updateTimer;
    let drawTimer;

    let currentUpdateCall = 0;
    let currentDrawCall = 0;

    //Drawing parameters
    // Netherlands size in meters (for drawing coordinates)
    const NL_MIN_X = 0;//482;
    const NL_MIN_Y = 284182;
    const NL_MAX_X = 466602;//306602;
    const NL_MAX_Y = 637049;//637049;
    const NL_width  = NL_MAX_X - NL_MIN_X;
    const NL_height = NL_MAX_Y - NL_MIN_Y;

    let canvas;
    let ctx;
    let mapImage;
    const rect = { x: 0, y: 0, width: 900, height: 600 };

    //Simulation variables (are read in, do not adjust)
    let population = 0;
    let infected = 0;
    let susceptible = 0;
    let recovered = 0;
    const MAX_HISTORY = 90;

    let historyS = [];
    let historyI = [];
    let historyR = [];

    //Start function
    onMount(() => {
        ctx = canvas.getContext('2d');
        //Prepare all the simulation data
        load();
        drawNL();

        //Run start on model
        start();

        updateTimer = setInterval(update, 1000 / updateHz);
        drawTimer = setInterval(draw, 1000 / drawHz);

        return () => {
            clearInterval(updateTimer);
            clearInterval(drawTimer);
        };
    });

    //Update loop, called {updateHz} times per second
    const update = () => {
        step();
        currentUpdateCall += 1;
    };

    //Draw loop, called {drawHz} times per second
    const draw = () => {
        //Update values from model with what should be displayed
        population = getTotalPopulation();
        susceptible = getTotalSusceptible();
        infected = getTotalInfected();
        recovered = getTotalRecovered();

        historyS = [...historyS, susceptible].slice(-MAX_HISTORY);
        historyI = [...historyI, infected].slice(-MAX_HISTORY);
        historyR = [...historyR, recovered].slice(-MAX_HISTORY);

        currentDrawCall += 1;

        clearMunicipalityDrawing();
        drawBaseMap(mapImage, ctx, rect);
        drawMunicipalityCircles(ctx, rect, 3);
    };

    //For drawing SIR graph
    function toPolylinePoints(history, maxY, width, height) {
        if (history.length < 2 || maxY <= 0) return "";

        return history
          .map((value, i) => {
              const x = Math.round((i / (MAX_HISTORY - 1)) * width);
              const y = Math.round(height - (value / maxY) * height);
              return `${x},${y}`;
          })
          .join("\n");
    }

    async function drawNL(){
        mapImage = new Image();
        mapImage.src = "src/lib/assets/Kaart nederland.png";
        await mapImage.decode();

        drawBaseMap(mapImage, ctx, rect);
        drawMunicipalityCircles(ctx, rect, 3);
    }

    function drawBaseMap(mapImage, ctx, rect) {
        ctx.drawImage(
          mapImage,
          rect.x,
          rect.y,
          rect.width,
          rect.height
        );
    }

    function metersToCanvas(xMeters, yMeters, rect) {
        const base_x_offset = 200;
        const scaleX = rect.width  / NL_width;
        const scaleY = rect.height / NL_height;
        const scale  = Math.min(scaleX, scaleY);

        return {
            x: rect.x + base_x_offset + (xMeters - NL_MIN_X) * scale,
            y: rect.y + (NL_MAX_Y - yMeters) * scale
        };
    }

    //Get color for circle based on how many infected
    function valueToColor(value) {
        const v = Math.max(0, Math.min(1, value)); // clamp
        const COLOR_STOPS = [
            { v: 0.00, r:   0, g: 176, b:  80 }, // green
            { v: 0.10, r: 255, g: 235, b:  59 }, // yellow
            { v: 0.25, r: 244, g:  67, b:  54 }, // red
            { v: 0.40, r: 183, g:  28, b:  28 }  // dark red
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

        // v >= last stop (0.40+)
        const last = COLOR_STOPS[COLOR_STOPS.length - 1];
        return `rgb(${last.r}, ${last.g}, ${last.b})`;
    }


    function drawMunicipalityCircles(ctx, rect, radius = 3) {
        ctx.save();
        const municipalityList = getMunicipalities();

        for (const municipality of municipalityList) {
            const centroid = getMunicipalityCentroid(municipality.gemeenteCode);
            const { x, y } = metersToCanvas(centroid.x, centroid.y, rect);

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = valueToColor(municipality.infected / municipality.population);
            ctx.fill();
        }

        ctx.restore();
    }

    function clearMunicipalityDrawing() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
</script>

<canvas bind:this={canvas} width="800" height="600" />

<div class="p-6 max-w-xl mx-auto">
    <h1 class="text-3xl font-bold mb-4">Ziekteverspreiding simulatie</h1>

    <svg width="600" height="300" class="border border-gray-300 bg-white">
        <!-- Susceptible -->
        <polyline
          fill="none"
          stroke="blue"
          stroke-width="2"
          points={toPolylinePoints(historyS, population, 600, 300)}
        />

        <!-- Infected -->
        <polyline
          fill="none"
          stroke="red"
          stroke-width="2"
          points={toPolylinePoints(historyI, population, 600, 300)}
        />

        <!-- Recovered -->
        <polyline
          fill="none"
          stroke="green"
          stroke-width="2"
          points={toPolylinePoints(historyR, population, 600, 300)}
        />
    </svg>

    <div class="flex gap-4 mt-2 text-sm">
        <span class="text-blue-600">Susceptible</span>
        <span class="text-red-600">Infected</span>
        <span class="text-green-600">Recovered</span>
    </div>

    <p class="mt-4 text-lg">Population: {population}, Susceptible: {susceptible}, Infected: {infected}, Recovered: {recovered}</p>

    <p class="mt-4 text-lg">Update call (simulation step): {currentUpdateCall} Draw call: {currentDrawCall}</p>
</div>
