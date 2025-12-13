import Papa from 'papaparse';
import csvBevolkingText from '../assets/datasets/IDP-bevolking-dataset.csv?raw';
import csvGeografieText from '../assets/datasets/IDP-geografie-dataset.csv?raw';

//Entry point of simulation

let municipalities = [];

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

        municipalities.push(normalized);
        codeToInternalId.set(normalized.gemeenteCode, index);
        idToCode.set(index, normalized.gemeenteCode);
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

function getMunicipalityByCode(gemeenteCode) {
    const id = codeToInternalId.get(gemeenteCode);
    if (id === undefined) return null;
    return municipalities[id];
}

export function getMunicipalityCount(){
    return municipalities.length;
}

export function codeToId(gemeenteCode) {
    return codeToInternalId.get(gemeenteCode);
}

export function idToGmCode(id) {
    return idToCode.get(id);
}

export function getMunicipalityName(gemeenteCode) {
    return getMunicipalityByCode(gemeenteCode)?.gemeenteNaam;
}

export function getMunicipalityPopulation(gemeenteCode) {
    return getMunicipalityByCode(gemeenteCode)?.bevolking;
}

export function getMunicipalityProvince(gemeenteCode) {
    return getMunicipalityByCode(gemeenteCode)?.provincieNaam;
}

export function getMunicipalityArea(gemeenteCode) {
    return getMunicipalityByCode(gemeenteCode)?.oppervlakteM2;
}

export function getMunicipalityCentroid(gemeenteCode) {
    const m = getMunicipalityByCode(gemeenteCode);
    return m ? { x: m.zwaartepuntX, y: m.zwaartepuntY } : null;
}

export function getMunicipalityPolygon(gemeenteCode) {
    const id = codeToInternalId.get(gemeenteCode);
    if (id === undefined) return null;

    const m = municipalities[id];
    return {
        x: m.polygonX,
        y: m.polygonY,
    };
}

export function getMunicipalityPolygonById(id) {
    const m = municipalities[id];
    if (!m) return null;

    return {
        x: m.polygonX,
        y: m.polygonY,
    };
}