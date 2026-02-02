import {
	municipalityCount, municipalityName, municipalityPopulation, municipalityProvince,
	municipalityArea, municipalityCentroid,
	getMunicipalities, setMunicipalities, getMunicipalityStats
} from './simulationData.js';

const transmissionRate = 0.25;
const recoveryRate = 0.1;
const dt = 1.0; //One day per tick
const contactScaling = 1.3; //Exponent for how many more contacts for bigger municipalities
const travelFactor = 0.3; //Fraction of population of municipality that travels to every other municipality
const distanceDecay = 0.9; //travelFactor*(KMs_distance)^this is the effect of distance
const vaccinationRate = 0.0; //TODO Change to per age group later
const waningRecoveryRate = 0.0; //Chance for recovered person to become infected again
const waningVaccinationRate = 0.00;
const mortalityRate = 0.0;
const d0 = 0.000001;

//Does the setup of stats
export function startModel(){
	const amsterdam = getMunicipalityStats("GM0363");
	const startingInfected = 10;
	amsterdam.infected = startingInfected;
	amsterdam.susceptible = amsterdam.susceptible - startingInfected;
}

//Runs a step of the simulation
export function stepModel() {
	const municipalities = getMunicipalities();
	const nextState = [];

	//Chances computed every frame in the case dt changes
	const recoveryChance = probFromRate(recoveryRate, dt);
	const waningRecoveryChance = probFromRate(waningRecoveryRate, dt);
	const vaccinationChance = probFromRate(vaccinationRate, dt);
	const waningVaccinationChance = probFromRate(waningVaccinationRate, dt);
	const mortalityChance = probFromRate(mortalityRate, dt);

	municipalities.forEach((municipality, i) => {
		//Contact weights W_ij
		const Wij = computeContactRow(i, municipalities);

		//Force of infection λ_i
		const infectionChance = forceOfInfection(i, municipalities, Wij);

		///Stochastic transitions
		//New infections / infection pressure
		const newInfections = binomialDraw(municipality.susceptible, infectionChance);
		//Recoveries
		const newRecoveries = binomialDraw(municipality.infected, recoveryChance);
		const newWaningRecoveries = binomialDraw(municipality.recovered, waningRecoveryChance);
		//Vaccinations
		const newVaccinations = binomialDraw(municipality.susceptible - municipality.infected, vaccinationChance);
		const newWaningVaccinations = binomialDraw(municipality.vaccinated, waningVaccinationChance);
		//Deaths
		const newDeaths = binomialDraw(municipality.infected, mortalityChance);

		//State update
		nextState.push({
			id: municipality.id,
			gemeenteCode: municipality.gemeenteCode,
			population: municipality.population,
			susceptible: municipality.susceptible - newInfections - newVaccinations + newWaningRecoveries + newWaningVaccinations,
			infected: municipality.infected + newInfections - newRecoveries - newDeaths,
			recovered: municipality.recovered + newRecoveries - newWaningRecoveries,
			vaccinated: municipality.vaccinated + newVaccinations - newWaningVaccinations,
			deaths: municipality.deaths + newDeaths,
			distances: municipality.distances,
		});
	});

	setMunicipalities(nextState);
}

//-------//
//Helpers//
//-------//
function binomialDraw(n, p) {
	let count = 0;
	for (let i = 0; i < n; i++) {
		if (Math.random() < p) count++;
	}
	return count;
}

function probFromRate(rate, dt){
	return 1 - Math.exp(-rate * dt);
}

//TODO this can be optimized
function computeContactRow(i, municipalities) {
	const raw = [];
	let sumRaw = 0;

	municipalities.forEach((mj, j) => {
		const dij = municipalities[i].distances[j];
		const value =
			Math.pow(mj.population, contactScaling) /
			Math.pow(dij + d0, distanceDecay);

		raw.push(value);
		sumRaw += value;
	});

	return raw.map(v => v / sumRaw);
}

function forceOfInfection(i, municipalities, Wij) {
	let lambda = 0;

	//TODO add age groups to this
	municipalities.forEach((mj, j) => {
		const infected_fraction = mj.infected / mj.population;
		lambda += Wij[j] * (infected_fraction);
	});

	lambda *= transmissionRate;

	return probFromRate(lambda, dt);
}