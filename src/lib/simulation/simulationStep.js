import {
	municipalityCount, municipalityName, municipalityPopulation, municipalityProvince,
	municipalityArea, municipalityCentroid, municipalityPolygon, municipalityPolygonById
} from './simulationData.js';

let transmissionRate = 0;
let recoveryRate = 0;
let contactScaling = 1.3; //Exponent for how many more contacts for bigger municipalities
let travelFactor = 0.3; //Fraction of population of municipality that travels to every other municipality
let distanceDecay = 0.9; //travelFactor*(KMs_distance)^this is the effect of distance


//Runs a step of the simulation
export function step(){

}