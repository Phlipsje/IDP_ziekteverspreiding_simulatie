<script>
	//import { selectedMunicipality } from '$lib/simulation/storables.js';
	import {
		municipalityName, municipalityPopulation, municipalitySusceptible, municipalityInfected,
		municipalityRecovered, municipalityVaccinated, municipalityDeaths
	} from '$lib/simulation/simulationData.js';
	import {getTotalPopulation, getTotalSusceptible, getTotalInfected, getTotalRecovered, getTotalVaccinated, getTotalDeaths } from '$lib/simulation/simulation.js';

	export let municipality = "NL";

	//$: municipality = $selectedMunicipality;
</script>

{#if municipality==="NL"}
	<p>Population: {getTotalPopulation()}</p>
	<p>Susceptible: {getTotalSusceptible()}</p>
	<p>Infected: {getTotalInfected()}</p>
	<p>Recovered: {getTotalRecovered()}</p>
	<p>Vaccinated: {getTotalVaccinated()}</p>
	<p>Dead: {getTotalDeaths()}</p>
	<!-- etc -->
{/if}
{#if municipality && municipality!=="NL"}
	<p>Population: {municipalityPopulation(municipality)}</p>
	<p>Infected: {municipalitySusceptible(municipality)}</p>
	<p>Infected: {municipalityInfected(municipality)}</p>
	<p>Recovered: {municipalityRecovered(municipality)}</p>
	<p>Vaccinated: {municipalityVaccinated(municipality)}</p>
	<p>Dead: {municipalityDeaths(municipality)}</p>
	<!-- etc -->
{/if}
