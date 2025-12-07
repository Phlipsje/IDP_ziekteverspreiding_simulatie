<script>
    import { browser } from '$app/environment';
    let result = null;
    let worker;

    // load the worker (Vite resolves this)
    if (browser) {
        // this only runs in the browser, not during SSR
        worker = new Worker(
            new URL('$lib/simulation/simulation-worker.js', import.meta.url),
            { type: 'module' }
        );

        worker.onmessage = (event) => {
            result = event.data;
        };
    }

    function start() {
        if (!browser) return; // safety

        result = "Running...";
        worker.postMessage({});
    }
</script>

<div class="p-6 max-w-xl mx-auto">
    <h1 class="text-3xl font-bold mb-4">Ziekteverspreiding simulatie</h1>

    <button
            on:click={start}
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
        Run Simulation
    </button>

    <p class="mt-4 text-lg">Result: {result}</p>
</div>
