//Entry point of simulation
import {
    loadDatasets,
    createMunicipalityObjects,
    municipalityCount,
    municipalityName,
    municipalityPopulation,
    municipalityProvince,
    municipalityArea,
    municipalityCentroid,
    municipalityBbox,
    getMunicipalities
} from './simulationData.js';
import { startModel, stepModel } from '$lib/simulation/simulationModel.js';
import { resetStats, updateStats } from '$lib/simulation/simulationStats.js';


export function load(){
    loadDatasets();
    createMunicipalityObjects();
}

export function start(){
    startModel();
    resetStats();
}

export function step(){
    stepModel();
    updateStats();
}

export function getMunicipalityCount(){
    return municipalityCount;
}

export function getMunicipalityName(gemeenteCode) {
    return municipalityName(gemeenteCode);
}

export function getMunicipalityPopulation(gemeenteCode) {
    return municipalityPopulation(gemeenteCode);
}

export function getMunicipalityProvince(gemeenteCode) {
    return municipalityProvince(gemeenteCode);
}

export function getMunicipalityArea(gemeenteCode) {
    return municipalityArea(gemeenteCode);
}

export function getMunicipalityCentroid(gemeenteCode) {
    return municipalityCentroid(gemeenteCode);
}

export function getMunicipalityBbox(gemeenteCode) {
    return municipalityBbox(gemeenteCode);
}

export function getTotalPopulation(){
    let value = 0;
    getMunicipalities().forEach((municipality) => {
        //Sum
        value += municipality.population[0] + municipality.population[1] + municipality.population[2];
    });
    return value;
}

export function getTotalSusceptible(){
    let value = 0;
    getMunicipalities().forEach((municipality) => {
        //Sum
        value += municipality.susceptible[0] + municipality.susceptible[1] + municipality.susceptible[2];
    });
    return value;
}

export function getTotalInfected(){
    let value = 0;
    getMunicipalities().forEach((municipality) => {
        //Sum
        value += municipality.infected[0] + municipality.infected[1] + municipality.infected[2];
    });
    return value;
}

export function getTotalRecovered(){
    let value = 0;
    getMunicipalities().forEach((municipality) => {
        //Sum
        value += municipality.recovered[0] + municipality.recovered[1] + municipality.recovered[2];
    });
    return value;
}

export function getTotalVaccinated(){
    let value = 0;
    getMunicipalities().forEach((municipality) => {
        //Sum
        value += municipality.vaccinated[0] + municipality.vaccinated[1] + municipality.vaccinated[2];
    });
    return value;
}

export function getTotalDeaths(){
    let value = 0;
    getMunicipalities().forEach((municipality) => {
        //Sum
        value += municipality.deaths[0] + municipality.deaths[1] + municipality.deaths[2];
    });
    return value;
}