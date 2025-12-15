//This file stores and loads all the data for the simulation
//Is also the file from which all the data is obtained
//This is the most 'upstream' file i.e. it does not import anything

import Papa from 'papaparse';
import csvBevolkingText from '../assets/datasets/IDP-bevolking-dataset.csv?raw';
import csvGeografieText from '../assets/datasets/IDP-geografie-dataset.csv?raw';

//Data is all the information that is loaded in
let municipalityData = [];
//Stats are all the values kept track of during the simulation
let municipalityStats = [];

const codeToInternalId = new Map();
const idToCode = new Map();
const geometryByCode = new Map();

export function loadDatasets(){
	const bevolkingParsed = Papa.parse(csvBevolkingText, {header: true}).data;
	const geografieParsed = Papa.parse(csvGeografieText, {header: true,skipEmptyLines: true}).data;

	// Parse and index geometry
	geografieParsed.forEach(row => {
		if (!row.polygon || !row.code) return;

		geometryByCode.set(
			row.code,
			parsePolygon(row.polygon)
		);
	});

	//Index municipalities
	bevolkingParsed.forEach((row, index) => {
		const geometry = geometryByCode.get(row.Gemeente_Code);

		const normalized = {
			id: index,
			gemeenteCode: row.Gemeente_Code,
			gemeenteNaam: row.Gemeente_Naam,
			provincieCode: row.Provincie_Code,
			provincieNaam: row.Provincie_Naam,
			bevolking: Number(row.Bevolking_Aantallen),
			zwaartepuntX: Number(row.zwaartepunt_x),
			zwaartepuntY: Number(row.zwaartepunt_y),
			oppervlakteM2: Number(row.oppervlakte_m2),

			// Geometry
			polygonX: geometry?.x ?? [],
			polygonY: geometry?.y ?? [],
		};

		municipalityData.push(normalized);
		codeToInternalId.set(normalized.gemeenteCode, index);
		idToCode.set(index, normalized.gemeenteCode);
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

		municipalityStats.push(stats.id);
	});
}

function parsePolygon(polygonString) {
	// Remove "POLYGON ((" prefix and "))" suffix
	const cleaned = polygonString
		.replace('POLYGON ((', '')
		.replace('))', '');

	const x = [];
	const y = [];

	const points = cleaned.split(',');

	for (let i = 0; i < points.length; i++) {
		const [px, py] = points[i].trim().split(/\s+/);
		x.push(Number(px));
		y.push(Number(py));
	}

	return { x, y };
}

//Gets the distance to all other municipalities
//Distances will contain itself
//Might be better to preprocess this with Python and put in dataset
function getDistances(gemeenteCode){
	const distances = [];

	municipalityData.forEach((row, index) => {
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
	return getMunicipalityData(gemeenteCode)?.oppervlakteM2;
}

export function municipalityCentroid(gemeenteCode) {
	const m = getMunicipalityData(gemeenteCode);
	return m ? { x: m.zwaartepuntX, y: m.zwaartepuntY } : null;
}

export function municipalityPolygon(gemeenteCode) {
	const id = codeToInternalId.get(gemeenteCode);
	if (id === undefined) return null;

	const m = municipalityData[id];
	return {
		x: m.polygonX,
		y: m.polygonY,
	};
}

export function municipalityPolygonById(id) {
	const m = municipalityData[id];
	if (!m) return null;

	return {
		x: m.polygonX,
		y: m.polygonY,
	};
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