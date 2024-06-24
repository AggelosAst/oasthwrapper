import {Oasth} from "./libs/Oasth";

const oasth = new Oasth({
	options: {
		reuseSessions: false
	}
})

oasth.getLines().then(async _ => {
	//Let your imagination unleash!
})
