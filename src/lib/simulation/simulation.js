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


export function load(){
    loadDatasets();
    createMunicipalityObjects();
}

export function start(){
    startModel();
}

export function step(){
    stepModel();
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
        value += municipality.population;
    });
    return value;
}

export function getTotalSusceptible(){
    let value = 0;
    getMunicipalities().forEach((municipality) => {
        value += municipality.susceptible;
    });
    return value;
}

export function getTotalInfected(){
    let value = 0;
    getMunicipalities().forEach((municipality) => {
        value += municipality.infected;
    });
    return value;
}

export function getTotalRecovered(){
    let value = 0;
    getMunicipalities().forEach((municipality) => {
        value += municipality.recovered;
    });
    return value;
}