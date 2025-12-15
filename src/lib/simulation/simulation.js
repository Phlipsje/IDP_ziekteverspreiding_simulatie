//Entry point of simulation
import {
    loadDatasets, createMunicipalityObjects,
    municipalityCount, municipalityName, municipalityPopulation, municipalityProvince,
    municipalityArea, municipalityCentroid, municipalityPolygon, municipalityPolygonById, getMunicipalities
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

export function readMunicipalityCount(){
    return municipalityCount;
}

export function readMunicipalityName(gemeenteCode) {
    return municipalityName(gemeenteCode);
}

export function readMunicipalityPopulation(gemeenteCode) {
    return municipalityPopulation(gemeenteCode);
}

export function readMunicipalityProvince(gemeenteCode) {
    return municipalityProvince(gemeenteCode);
}

export function readMunicipalityArea(gemeenteCode) {
    return municipalityArea(gemeenteCode);
}

export function readMunicipalityCentroid(gemeenteCode) {
    return municipalityCentroid(gemeenteCode);
}

export function readMunicipalityPolygon(gemeenteCode) {
    return municipalityPolygon(gemeenteCode);
}

export function readMunicipalityPolygonById(id) {
    return municipalityPolygonById(id);
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