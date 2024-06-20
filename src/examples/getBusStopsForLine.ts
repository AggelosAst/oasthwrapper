/*
	This gets all the bus stops (for Return and Arrival routes) and prints them nicely to the console
*/

import {Oasth} from "../libs/Oasth";
import {Stop} from "../types/stopsAndDetails";

const oasth = new Oasth({
	options: {
		reuseSessions: false
	}
})

oasth.getLines().then(async a => {
	const Stops: Stop[] = await oasth.getBusStops("03K", "Return")
	
	const formattedStops: string[] = Stops.map(stop => {
		return `${stop.StopDescr} => (AMEA Accessibility: ${stop.StopAmea === "0" ? "No" : "Yes"}, Street: ${stop.StopStreet})`
	})
	
	console.log(formattedStops.join("\n"))
})

