///--------------------
///This script collects the data from what has happened in the simulation and stores it for shared access
///Can then later be used to retrieve data needed to draw
///--------------------

import { getTotalPopulation, getTotalSusceptible, getTotalInfected, getTotalRecovered
} from './simulation.js';

const startDate = new Date("2025-01-01");
//CurrentDay is the amount of days since the start date (including the start date itself), it final index of every array found in this file
let currentDay = 0;

//This is the data we want to access for the frontend
//An array, index is the relevant amount of days since the start date, value is an object containing all statistical information of that point in time
let snapshots = [];

//Turns integer day into date format
export function toDate(totalDays){
	let date = new Date(startDate);
	date.setDate(totalDays+1); //+1 for date to align
	return date;
}

function dateDaysApart(start, end){
	let timeDifference = end - start;
	return timeDifference / (1000 * 3600 * 24);
}

function indexFromDate(date){
	return dateDaysApart(startDate, date);
}

export function currentDate(){
	return toDate(currentDay);
}

//Call this when resetting the simulation
export function resetStats(){
	currentDay = -1; //-1 because updated by 1 when updateStats is called in this
	snapshots = [];

	updateStats();
}

//Call this when a step has passed and the data needs to be updated
export function updateStats(){
	currentDay++;

	const snapshot = {
		day: currentDay,
		date: currentDate(),
		population: getTotalPopulation(),
		susceptible: getTotalSusceptible(),
		infected: getTotalInfected(),
		recovered: getTotalRecovered(),
		//Add more stats as they become relevant
	}
	snapshots.push(snapshot);
}

export function getStats(currentDay){
	if(typeof currentDay === 'number'){
		return snapshots[currentDay];
	}
	else {
		return snapshots[indexFromDate(currentDay)];
	}
}

export function getStatsInRange(start, end){
	let sIndex = 0;
	let eIndex = 0;
	if(typeof start === 'number')
		sIndex = start;
	else
		sIndex = indexFromDate(start);
	if(typeof end === 'number')
		eIndex = end;
	else
		eIndex = indexFromDate(end);

	return snapshots.slice(sIndex, eIndex+1);
}

export function getMostRecentStats(days){
	let begin = Math.max(0, currentDay-days);
	return getStatsInRange(begin, currentDay);
}