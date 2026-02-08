import { writable } from 'svelte/store';

///A file to make store objects so that we can easily share a few things across svelte components

//Store for which municipality is selected
export const selectedMunicipality = writable(null);