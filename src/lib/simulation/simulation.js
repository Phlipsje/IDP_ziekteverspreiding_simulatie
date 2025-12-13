//Entry point of simulation
import {
    loadDatasets, createMunicipalityObjects,
    municipalityCount, municipalityName, municipalityPopulation, municipalityProvince,
    municipalityArea, municipalityCentroid, municipalityPolygon, municipalityPolygonById
} from './simulationData.js';


export function load(){
    loadDatasets();
    createMunicipalityObjects();
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