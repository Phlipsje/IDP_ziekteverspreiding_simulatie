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
    const NL_width = 280000;
    const NL_height = 680000;

    const NL_rectangle = {
        x: 0,
        y: 0,
        width: 800,
        height: 600
    };
    let canvas;
    let ctx;
    let drawable;
    const rect = { x: 0, y: 0, width: 800, height: 600 };
    let color = "#1E88E5"; //Temp fixed color

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
        //Prepare all the simulation data
        load();
        prepareMunicipalityDrawing();

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

    //For drawing municipality PNGs
    function mapToRect(xMeters, yMeters, rect) {
        const scaleX = rect.width / NL_width;
        const scaleY = rect.height / NL_height;

        // keep correct aspect ratio by using the smaller scale
        const scale = Math.min(scaleX, scaleY);

        return {
            x: rect.x + xMeters * scale,
            // invert Y so “up” in meters becomes “up” on screen
            y: rect.y + (NL_height - yMeters) * scale,
            scale
        };
    }

    async function loadMunicipalityDrawable(municipalityCode, rect) {
        // 1. centroid in meters
        const centroid = getMunicipalityCentroid(municipalityCode);
        const bbox = getMunicipalityBbox(municipalityCode);

        // 2. image path (adjust if your directory differs)
        const imgUrl = `src/lib/assets/datasets/municipality_pngs/${municipalityCode}.png`;

        // 3. preload image
        const img = new Image();
        img.src = imgUrl;
        await img.decode();

        // 4. convert centroid to draw position
        const mapped = mapToRect(centroid.x, centroid.y, rect);

        let obj = {
            code: municipalityCode,
            centroid,
            image: img,
            draw: {
                x: mapped.x,
                y: mapped.y,
                scale: mapped.scale,
                width: bbox.width * mapped.scale,
                height: bbox.height * mapped.scale
            }
        };

        // 5. return render-ready object
        return obj;
    }

    function clearMunicipalityDrawing() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    async function prepareMunicipalityDrawing(){
        ctx = canvas.getContext("2d");
        clearMunicipalityDrawing();
        const municipalityList = getMunicipalities();

        const drawables = await Promise.all(
          municipalityList.map(municipality => loadMunicipalityDrawable(municipality.gemeenteCode, rect))
        );

        // draw each municipality
        for (const drawable of drawables) {
            drawMunicipality(ctx, drawable, color);
        }

        // then recolor all drawn pixels
        colorize(ctx, color);
    }

    function drawMunicipality(ctx, drawable, color) {
        const { image, draw } = drawable;

        // draw the base image
        ctx.drawImage(
          image,
          draw.x - draw.width / 2,
          draw.y - draw.height / 2,
          draw.width,
          draw.height
        );
    }

    // recolor everything already drawn
    function colorize(ctx, color) {
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalCompositeOperation = "source-over";
    }

    // re-draw automatically if the color changes
    $: if (ctx && drawable) {
        drawMunicipality(ctx, drawable, color);
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
