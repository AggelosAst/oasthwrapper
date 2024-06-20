/*
	This tracks the location of the current busses (you can edit it to whichever bus you want) and tells you how close the bus is
	to a bus stop. Using haversine, the distance is accurately calculated and with a default threshold of 300m, the results are
	sorted to the closest one to teh bus.
*/

import {Oasth} from "../libs/Oasth";
import {Stop} from "../types/stopsAndDetails";
import {BusLocationData} from "../types/BusLocationData";
import haversine from "haversine"
import {ClosestStop} from "../types/closestStop";

const oasth = new Oasth({
	options: {
		reuseSessions: false
	}
})

oasth.getLines().then(async a => {
	const Stops: Stop[] = await oasth.getBusStops("03K", "Return")
	
	setInterval(async () => {
		const BusLocations: BusLocationData[] = await oasth.getBusLocation("03K", "Return")
		if (BusLocations.length > 0) {
			const firstBus: BusLocationData = BusLocations.find(bus => bus.VEH_NO === "2615")!  /* Or format it to the bus you want by vehicle Number */
			console.log(`[BUS COORDS]: Longtitude: ${firstBus.CS_LNG} Latitude: ${firstBus.CS_LAT}`) /* DEBUG: Print the buses location */
			
			const closestStops: ClosestStop[] = []
			
			for (const stop of Stops) {
				const haversineFormula: number = haversine({
					longitude: parseFloat(firstBus.CS_LNG),
					latitude: parseFloat(firstBus.CS_LAT)
				}, {
					longitude: parseFloat(stop.StopLng),
					latitude: parseFloat(stop.StopLat)
				}, {
					unit: "meter"
				})
				if (haversineFormula <= 300) { /* Entirely configurable. */
					const Stop: ClosestStop = stop as ClosestStop
					Stop.distance = haversineFormula
					closestStops.push(Stop)
				}
			}
			closestStops.sort((firstStop: ClosestStop, secondStop: ClosestStop) => firstStop.distance! - secondStop.distance!)
			
			closestStops.forEach(closestStop => {
				console.log(`[${firstBus.VEH_NO}] [${closestStop.StopDescr.trim()}]: The bus is approaching \x1b[32m[${closestStop.StopDescr.trim()}]\x1b[0m! The distance of the bus to the bus stop is ${closestStop.distance}μ.`)
			})
		}
	}, 5000)
})
