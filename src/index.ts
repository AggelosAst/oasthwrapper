/*
	This tracks the location of the current busses (you can edit it to whichever bus you want) and tells you how close the bus is
	to a bus stop. Using haversine, the distance is accurately detected and with a default threshold of 300m, the results are
	sorted to the closest one to teh bus.
*/

import {Oasth} from "./libs/Oasth";
import {Stop} from "./types/stopsAndDetails";
import {BusLocationData} from "./types/BusLocationData";
import haversine from "haversine"
import {ClosestStop} from "./types/closestStop";
import {Line} from "./types/line";

const oasth = new Oasth({
	options: {
		reuseSessions: false
	}
})

oasth.getLines().then(async a => {
	const lineID: string = "87L"
	const direction: "Return" | "To Arrival" = "Return"
	const Stops: Stop[] = await oasth.getBusStops(lineID, direction)
	const LineInfo: Line | undefined = await oasth.getLineIDInfo(lineID)
	
	let targetBus: string
	const RouteOrder = Stops.map(stop => {
		return {
			routeOrder: stop.RouteStopOrder,
			name: stop.StopDescr
		}
	})
	const lastStop = RouteOrder[RouteOrder.length - 1]
	
	setInterval(async () => {
		const BusLocations: BusLocationData[] = await oasth.getBusLocation(lineID, direction)
		if (BusLocations.length > 0) {
			const firstBus: BusLocationData = BusLocations.find(bus => bus.VEH_NO === "4036")!  /* Or format it to the bus you want by vehicle Number */
			targetBus = firstBus.VEH_NO;
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
				console.log(`[${firstBus.VEH_NO}] [${closestStop.StopDescr.trim()}] [${LineInfo?.LineDescr}] [${direction}]: The bus is approaching \x1b[32m[${closestStop.StopDescr.trim()}]\x1b[0m! The distance of the bus to the bus stop is ${closestStop.distance}μ. Bus Stop ${closestStop.RouteStopOrder} out of ${lastStop.routeOrder}. ${parseInt(lastStop.routeOrder) - parseInt(closestStop.RouteStopOrder)} Bus Stops left.`)
			})
			console.log("\n\n")
		} else {
			if (targetBus) {
				console.log(`[${targetBus}] [${LineInfo?.LineDescr}]: The bus has arrived to the destination \x1b[32m[${lastStop.name.trim()}]\x1b[0m!, the ${lastStop.routeOrder}th bus stop.`)
			}
		}
	}, 2000)
})
