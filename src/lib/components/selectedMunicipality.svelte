<script>
	import { selectedMunicipality } from '$lib/simulation/storables.js';
	import { municipalityName, municipalityPopulation, municipalityInfected,
		municipalityRecovered, municipalityVaccinated, municipalityDeaths} from '$lib/simulation/simulationData.js';

	$: municipality = $selectedMunicipality;
</script>

{#if municipality}
	<h2>{municipalityName(municipality)}</h2>
	<p>Population: {municipalityPopulation(municipality)}</p>
	<p>Infected: {municipalityInfected(municipality)}</p>
	<p>Recovered: {municipalityRecovered(municipality)}</p>
	<p>Vaccinated: {municipalityVaccinated(municipality)}</p>
	<p>Dead: {municipalityDeaths(municipality)}</p>
	<!-- etc -->
{/if}
