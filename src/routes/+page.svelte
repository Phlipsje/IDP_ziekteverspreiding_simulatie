<script>
    import { onMount, onDestroy } from "svelte";
    import { load } from '../lib/simulation/simulation.js';

    const updateHz = 30;
    const drawHz = 20;

    let updateTimer;
    let drawTimer;

    let exampleInfected = 1;
    let exampleSusceptible = 100 - exampleInfected;
    let exampleRecovered = 0;

    //Update loop, called {updateHz} times per second
    const update = () => {
        //Just random bullshit to check if update loop works
        if(exampleSusceptible > 0) {
            exampleSusceptible--;
            exampleInfected++;
        }
        if(Math.random() < 0.50)
        {
            exampleInfected--;
            exampleRecovered++;
        }
    };

    //Draw loop, called {drawHz} times per second
    const draw = () => {
        //
    };

    //Start function
    onMount(() => {
        updateTimer = setInterval(update, 1000 / updateHz);
        drawTimer = setInterval(draw, 1000 / drawHz);

        //Prepare all the simulation data
        load();

        return () => {
            clearInterval(updateTimer);
            clearInterval(drawTimer);
        };
    });
</script>

<div class="p-6 max-w-xl mx-auto">
    <h1 class="text-3xl font-bold mb-4">Ziekteverspreiding simulatie</h1>

    <p class="mt-4 text-lg">Susceptible: {exampleSusceptible}, Infected: {exampleInfected}, Recovered: {exampleRecovered}</p>
</div>
