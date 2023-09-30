// ====================================
//             Requirements
// ====================================
const express = require("express");

// Routes
const apiRouter = express.Router();


// Database
const DailyProgress = require("../database/dailyProgress");

//========================
//          json
//========================

apiRouter.get("/timesheets/calendarView", async (req, res, next) => {
	// Get daily progress
	let data = await DailyProgress.find({})
		.populate("hoursWorked.projectWorkedOn")
		.exec();

	// setup events
	const events = [];

	// looping each day
	data.forEach((eventData) => {
		const dailyEvents = eventData.hoursWorked;
		// looping every hoursWorked value to add as an event
		dailyEvents.forEach((dailyEvent) => {
			const event = {
				// id: eventData._id,
				title: dailyEvent.projectWorkedOn.name,
				start: dailyEvent.from.toISOString(), // Use the "day" field as the start date/time
				end: dailyEvent.to.toISOString(), // Use the "day" field as the start date/time
				// Add more properties as needed
			};
			events.push(event);
		});
	});

	res.json(events);
});



//========================
//          Exports
//========================
module.exports = apiRouter;
