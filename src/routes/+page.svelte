<script>
    import { browser } from '$app/environment';
    import { onMount, onDestroy } from "svelte";
    let result = null;
    let worker;

    let updateHz = 30;
    let drawHz = 20;

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

        if (browser){
            worker.postMessage({});
        }
        else{
            console.log("Error browser not loaded yet!")
        }

        return () => {
            clearInterval(updateTimer);
            clearInterval(drawTimer);
        };
    });

    //Loads in resources
    if (browser) {
        //Uses workers to offload loading
        worker = new Worker(
            new URL('$lib/simulation/simulation-worker.js', import.meta.url),
            { type: 'module' }
        );

        worker.onmessage = (event) => {
            result = event.data;
        };
    }
</script>

<div class="p-6 max-w-xl mx-auto">
    <h1 class="text-3xl font-bold mb-4">Ziekteverspreiding simulatie</h1>

    <p class="mt-4 text-lg">Susceptible: {exampleSusceptible}, Infected: {exampleInfected}, Recovered: {exampleRecovered}</p>
</div>
