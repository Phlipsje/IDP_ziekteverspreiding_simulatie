<script>
	//import { selectedMunicipality } from '$lib/simulation/storables.js';
	import {
		municipalityName, municipalityPopulation, municipalitySusceptible, municipalityInfected,
		municipalityRecovered, municipalityVaccinated, municipalityDeaths
	} from '$lib/simulation/simulationData.js';
	import {getTotalPopulation, getTotalSusceptible, getTotalInfected, getTotalRecovered, getTotalVaccinated, getTotalDeaths } from '$lib/simulation/simulation.js';

	export let municipality = "NL";
	export let refreshCycle = 0;

	let population = 0;
	let susceptible = 0;
	let infected = 0;
	let recovered = 0;
	let vaccinated = 0;
	let deaths = 0;

	$: if(refreshCycle) {
		if(municipality==="NL"){
			population = getTotalPopulation();
			susceptible = getTotalSusceptible();
			infected = getTotalInfected();
			recovered = getTotalRecovered();
			vaccinated = getTotalVaccinated();
			deaths = getTotalDeaths();
		}
		else
		{
			population = municipalityPopulation(municipality);
			susceptible = municipalitySusceptible(municipality);
			infected = municipalityInfected(municipality);
			recovered = municipalityRecovered(municipality);
			vaccinated = municipalityVaccinated(municipality);
			deaths = municipalityDeaths(municipality);
		}
	}
</script>

{#if municipality}
	<p>Population: {population}</p>
	<p>Susceptible: {susceptible}</p>
	<p>Infected: {infected}</p>
	<p>Recovered: {recovered}</p>
	<p>Vaccinated: {vaccinated}</p>
	<p>Deaths: {deaths}</p>
{/if}