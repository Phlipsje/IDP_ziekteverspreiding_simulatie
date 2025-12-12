import Papa from 'papaparse';
import csvBevolkingText from '../assets/datasets/IDP-bevolking-dataset.csv?raw';
import csvGeografieText from '../assets/datasets/IDP-geografie-dataset.csv?raw';

//Entry point of simulation

let bevolkingData;
let geografieData;

export function loadDatasets(){
    bevolkingData = Papa.parse(csvBevolkingText, {header: true}).data;
    geografieData = Papa.parse(csvGeografieText, {header: true}).data;

    return bevolkingData;
}