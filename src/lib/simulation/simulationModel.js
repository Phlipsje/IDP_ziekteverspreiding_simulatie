import {
	municipalityCount, municipalityName, municipalityPopulation, municipalityProvince,
	municipalityArea, municipalityCentroid,
	getMunicipalities, setMunicipalities, getMunicipalityStats
} from './simulationData.js';

const transmissionRate = 0.25;
const dt = 1.0; //One day per tick
const contactScaling = 1.3; //Exponent for how many more contacts for bigger municipalities
const travelFactor = 0.3; //Fraction of population of municipality that travels to every other municipality
const distanceDecay = 0.9; //travelFactor*(KMs_distance)^this is the effect of distance
const recoveryRate = [0.12, 0.1, 0.08]; // 0–17, 18–65, 65+
const waningRecoveryRate = [0.0, 0.0, 0.0]; // 0–17, 18–65, 65+
const vaccinationRate = [0.0, 0.0, 0.0]; // 0–17, 18–65, 65+
const waningVaccinationRate = [0.0, 0.0, 0.0]; // 0–17, 18–65, 65+
const mortalityRate = [0.0001, 0.001, 0.01]; // 0–17, 18–65, 65+
const d0 = 0.000001; //Miniscule value to not get divide by 0's
// How age groups mix with each other (rows sum to 1)
const AGE_GROUPS = 3;
const ageContactMatrix = [
	[0.7, 0.25, 0.05],
	[0.2, 0.7, 0.1],
	[0.1, 0.3, 0.6],
];

//Does the setup of stats
export function startModel(){
	const amsterdam = getMunicipalityStats("GM0363");
	const startingInfected = 10;
	amsterdam.infected[1] = startingInfected;
	amsterdam.susceptible[1] = amsterdam.susceptible[1] - startingInfected;
}

//Runs a step of the simulation
export function stepModel() {
	const municipalities = getMunicipalities();
	const nextState = [];

	municipalities.forEach((municipality, i) => {
		const updatedMunicipality = structuredClone(municipality);

		for (let a = 0; a < AGE_GROUPS; a++) {

			//TODO this part can be moved outside loop with small optimization later
			//Chances computed every frame in the case dt changes
			const recoveryChance = probFromRate(recoveryRate[a], dt);
			const waningRecoveryChance = probFromRate(waningRecoveryRate[a], dt);
			const vaccinationChance = probFromRate(vaccinationRate[a], dt);
			const waningVaccinationChance = probFromRate(waningVaccinationRate[a], dt);
			const mortalityChance = probFromRate(mortalityRate[a], dt);

			//Contact weights W_ij
			computeContactRow(i, municipalities);

			//Force of infection λ_i
			const infectionChance = forceOfInfection(i, a, municipalities, municipality.contactRow);

			///Stochastic transitions
			//New infections / infection pressure
			const newInfections = binomialDraw(municipality.susceptible[a], infectionChance);
			//Recoveries
			const newRecoveries = binomialDraw(municipality.infected[a], recoveryChance);
			const newWaningRecoveries = binomialDraw(municipality.recovered[a], waningRecoveryChance);
			//Vaccinations
			const newVaccinations = binomialDraw(municipality.susceptible[a] - newInfections, vaccinationChance);
			const newWaningVaccinations = binomialDraw(municipality.vaccinated[a], waningVaccinationChance);
			//Deaths
			const newDeaths = binomialDraw(municipality.infected[a], mortalityChance);

			updatedMunicipality.population[a] += -newDeaths;
			updatedMunicipality.susceptible[a] += -newInfections - newVaccinations + newWaningRecoveries + newWaningVaccinations;
			updatedMunicipality.infected[a] += newInfections - newRecoveries - newDeaths;
			updatedMunicipality.recovered[a] += newRecoveries - newWaningRecoveries;
			updatedMunicipality.vaccinated[a] += newVaccinations - newWaningVaccinations;
			updatedMunicipality.deaths[a] += newDeaths;
		}

		//State update
		nextState.push(updatedMunicipality);
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

function computeContactRow(i, municipalities) {
	let sumRaw = 0;

	municipalities.forEach((mj, j) => {
		const dij = municipalities[i].distances[j];
		const value =
			Math.pow(mj.population[0]+mj.population[1]+mj.population[2], contactScaling) /
			Math.pow(dij + d0, distanceDecay);

		municipalities[i].contactRow[j] = value * travelFactor;
		sumRaw += value;
	});

	const inv = 1 / sumRaw;
	for (let j = 0; j < municipalities[i].contactRow.length; j++) {
		municipalities[i].contactRow[j] *= inv;
	}
}

function forceOfInfection(i, a, municipalities, Wij) {
	let lambda = 0;

	municipalities.forEach((mj, j) => {
		for (let b = 0; b < AGE_GROUPS; b++) {
			const relevantPop =
				mj.susceptible[b] +
				mj.infected[b] +
				mj.recovered[b] +
				mj.vaccinated[b];

			const infectedFraction = mj.infected[b] / relevantPop;

			lambda += Wij[j] * ageContactMatrix[a][b] * infectedFraction;
		}
	});

	lambda *= transmissionRate;

	return probFromRate(lambda, dt);
}
