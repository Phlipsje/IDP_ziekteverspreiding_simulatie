<script>
    import { onMount, onDestroy } from "svelte";
    import { load, start, step,
             getTotalPopulation, getTotalSusceptible, getTotalInfected, getTotalRecovered
    } from '../lib/simulation/simulation.js';

    const updateHz = 30;
    const drawHz = 20;

    let updateTimer;
    let drawTimer;

    let currentUpdateCall = 0;
    let currentDrawCall = 0;

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


</script>

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
