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
	//Let your imagination unleash!
})
