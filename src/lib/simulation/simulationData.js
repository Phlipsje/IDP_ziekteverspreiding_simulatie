//This file stores and loads all the data for the simulation
//Is also the file from which all the data is obtained
//This is the most 'upstream' file i.e. it does not import anything

import Papa from 'papaparse';
import csvBevolkingText from '../assets/datasets/IDP-bevolking-dataset.csv?raw';
import csvGeografieText from '../assets/datasets/IDP-geografie-dataset.csv?raw';

//Data is all the information that is loaded in
let municipalityData = [];
let municipalityGeography = [];
//Stats are all the values kept track of during the simulation
let municipalityStats = [];

const codeToInternalId = new Map();
const idToCode = new Map();

export function loadDatasets(){
	const bevolkingParsed = Papa.parse(csvBevolkingText, {header: true}).data;
	const geografieParsed = Papa.parse(csvGeografieText, {header: true,skipEmptyLines: true}).data;

	//Dataset's final line might be empty, this would then remove it from the dataset
	/*
	if(bevolkingParsed[bevolkingParsed.length-1].Gemeente_Code === undefined){
		bevolkingParsed.take(bevolkingParsed.length-1);
	}
	if(geografieParsed[geografieParsed.length-1].Gemeente_Code === undefined){
		geografieParsed.take(geografieParsed.length-1);
	}
	*/

	//Index municipalities and municipality data
	bevolkingParsed.forEach((row, index) => {
		const normalized = {
			id: index,
			gemeenteCode: row.Gemeente_Code,
			gemeenteNaam: row.Gemeente_Naam,
			provincieCode: row.Provincie_Code,
			provincieNaam: row.Provincie_Naam,
			bevolking: Number(row.Bevolking_Aantallen),
		};

		municipalityData.push(normalized);
		codeToInternalId.set(normalized.gemeenteCode, index);
		idToCode.set(index, normalized.gemeenteCode);
	});

	// Municipality geography info
	geografieParsed.forEach((row, index) => {
		const normalized = {
			id: index,
			gemeenteCode: row.Gemeente_Code,
			gemeenteNaam: row.Gemeente_Naam,
			zwaartepuntX: Number(row.zwaartepunt_x),
			zwaartepuntY: Number(row.zwaartepunt_y),
			oppervlakteM2: Number(row.oppervlakte_m2),
			bboxWidth: Number(row.bbox_width),
			bboxHeight: Number(row.bbox_height)
		};

		municipalityGeography.push(normalized);
	});
}

export function createMunicipalityObjects(){
	municipalityData.forEach((row, index) => {
		const stats = {
			id: index,
			gemeenteCode: row.gemeenteCode,
			population: row.bevolking,
			susceptible: row.bevolking,
			infected: 0,
			recovered: 0,
			distances: getDistances(row.gemeenteCode), //Note that distances will contain itself
		};

		municipalityStats.push(stats);
	});
}

//Gets the distance to all other municipalities
//Distances will contain itself
//Might be better to preprocess this with Python and put in dataset
function getDistances(gemeenteCode){
	const distances = [];

	municipalityGeography.forEach((row, index) => {
		//Make numbers in KMs rounded to nearest int, we do not need extra precision
		let x = (row.zwaartepuntX / 1000) - (municipalityCentroid(gemeenteCode).x / 1000);
		let y = row.zwaartepuntY / 1000 - (municipalityCentroid(gemeenteCode).y / 1000);
		let distance = Math.round(Math.sqrt(x * x + y * y));
		distances.push(distance);
	})

	return distances;
}

export function getMunicipalityData(gemeenteCode) {
	const id = codeToInternalId.get(gemeenteCode);
	if (id === undefined) return null;
	return municipalityData[id];
}

export function getMunicipalityGeography(gemeenteCode) {
	const id = codeToInternalId.get(gemeenteCode);
	if (id === undefined) return null;
	return municipalityGeography[id];
}

export function getMunicipalityStats(gemeenteCode) {
	const id = codeToInternalId.get(gemeenteCode);
	if (id === undefined) return null;
	return municipalityStats[id];
}

export function getMunicipalities(){
	return municipalityStats;
}

export function setMunicipalities(nextState){
	municipalityStats = nextState;
}

export function codeToId(gemeenteCode) {
	return codeToInternalId.get(gemeenteCode);
}

export function idToGmCode(id) {
	return idToCode.get(id);
}

export function municipalityCount(){
	return municipalityData.length;
}

export function municipalityName(gemeenteCode) {
	return getMunicipalityData(gemeenteCode)?.gemeenteNaam;
}

export function municipalityPopulation(gemeenteCode) {
	return getMunicipalityData(gemeenteCode)?.bevolking;
}

export function municipalityProvince(gemeenteCode) {
	return getMunicipalityData(gemeenteCode)?.provincieNaam;
}

export function municipalityArea(gemeenteCode) {
	return getMunicipalityGeography(gemeenteCode)?.oppervlakteM2;
}

export function municipalityCentroid(gemeenteCode) {
	const m = getMunicipalityGeography(gemeenteCode);
	return m ? { x: m.zwaartepuntX, y: m.zwaartepuntY } : null;
}

export function municipalityBbox(gemeenteCode) {
	const m = getMunicipalityGeography(gemeenteCode);
	return m ? { width: m.bboxWidth, height: m.bboxHeight } : null;
}

export function municipalitySusceptible(gemeenteCode){
	return getMunicipalityStats(gemeenteCode)?.susceptible;
}

export function municipalityInfected(gemeenteCode){
	return getMunicipalityStats(gemeenteCode)?.infected;
}

export function municipalityRecovered(gemeenteCode){
	return getMunicipalityStats(gemeenteCode)?.recovered;
}

export function municipalityDistances(gemeenteCode){
	return getMunicipalityStats(gemeenteCode)?.distances;
}