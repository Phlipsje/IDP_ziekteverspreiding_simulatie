import { loadDatasets } from './simulation.js';

self.onmessage = (e) => {
    const result = loadDatasets();
    self.postMessage(result);
};
