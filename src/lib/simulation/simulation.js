import Papa from 'papaparse';
import csvBevolkingText from '../assets/datasets/IDP-bevolking-dataset.csv?raw';
import csvGeografieText from '../assets/datasets/IDP-geografie-dataset.csv?raw';

//Entry point of simulation

export function loadDatasets(){
    const bevolkingData = Papa.parse(csvBevolkingText, {header: true}).data;
    const geografieData = Papa.parse(csvGeografieText, {header: true}).data;

    return bevolkingData;
}