<script>
    import { onMount, onDestroy } from "svelte";
    import { load, start, step,
             getTotalPopulation, getTotalSusceptible, getTotalInfected, getTotalRecovered
    } from '../lib/simulation/simulation.js';

    const updateHz = 30;
    const drawHz = 20;

    let updateTimer;
    let drawTimer;

    let population = 0;
    let infected = 0;
    let susceptible = 0;
    let recovered = 0;

    //Start function
    onMount(() => {
        updateTimer = setInterval(update, 1000 / updateHz);
        drawTimer = setInterval(draw, 1000 / drawHz);

        //Prepare all the simulation data
        load();

        //Run start on model
        start();

        return () => {
            clearInterval(updateTimer);
            clearInterval(drawTimer);
        };
    });

    //Update loop, called {updateHz} times per second
    const update = () => {
        step();
    };

    //Draw loop, called {drawHz} times per second
    const draw = () => {
        //Update values from model with what should be displayed
        population = getTotalPopulation();
        susceptible = getTotalSusceptible();
        infected = getTotalInfected();
        recovered = getTotalRecovered();
    };
</script>

<div class="p-6 max-w-xl mx-auto">
    <h1 class="text-3xl font-bold mb-4">Ziekteverspreiding simulatie</h1>

    <p class="mt-4 text-lg">Population: {population}, Susceptible: {susceptible}, Infected: {infected}, Recovered: {recovered}</p>
</div>
