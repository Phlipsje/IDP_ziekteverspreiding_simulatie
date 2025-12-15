import {
	municipalityCount, municipalityName, municipalityPopulation, municipalityProvince,
	municipalityArea, municipalityCentroid, municipalityPolygon, municipalityPolygonById,
	getMunicipalities, setMunicipalities, getMunicipalityStats
} from './simulationData.js';

const transmissionRate = 0.25;
const recoveryRate = 0.1;
const deltaT = 1.0;
const contactScaling = 1.3; //Exponent for how many more contacts for bigger municipalities
const travelFactor = 0.3; //Fraction of population of municipality that travels to every other municipality
const distanceDecay = 0.9; //travelFactor*(KMs_distance)^this is the effect of distance
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

	municipalities.forEach((municipality, i) => {
		// 1. Contact weights W_ij
		const Wij = computeContactRow(i, municipalities);

		// 2. Force of infection λ_i
		const lambda = forceOfInfection(i, municipalities, Wij);

		// 3. Transition probabilities
		const pInf = 1 - Math.exp(-lambda * deltaT);
		const pRec = 1 - Math.exp(-recoveryRate * deltaT);

		// 4. Stochastic transitions
		const newInfections = binomialDraw(municipality.susceptible, pInf);
		const newRecoveries = binomialDraw(municipality.infected, pRec);

		// 5. State update
		nextState.push({
			id: municipality.id,
			gemeenteCode: municipality.gemeenteCode,
			population: municipality.population,
			susceptible: municipality.susceptible - newInfections,
			infected: municipality.infected + newInfections - newRecoveries,
			recovered: municipality.recovered + newRecoveries,
			distances: municipality.distances,
		});
	});

	setMunicipalities(nextState);
}

function binomialDraw(n, p) {
	let count = 0;
	for (let i = 0; i < n; i++) {
		if (Math.random() < p) count++;
	}
	return count;
}

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

	municipalities.forEach((mj, j) => {
		if (mj.population > 0) {
			lambda += Wij[j] * (mj.infected / mj.population);
		}
	});

	return transmissionRate * lambda;
}