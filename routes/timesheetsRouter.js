// ====================================
//             Requirements
// ====================================
const express = require('express');
const timesheetsRouter = express.Router();

// Helpers
const { findAddOrUpdate } = require("./helpers.js");



//========================
//          View
//========================

timesheetsRouter.get("/", (req, res, next) => {
	DailyProgress.find().then((data) => {
		res.render("main/list", {
			data,
			flyingIcon: "fa-solid fa-plus",
			pageToFlyTo: "/add",
		});
	});
});

//========================
//          Add
//========================

timesheetsRouter.get(["/add"], (req, res, next) => {
	// Setting up today's date
	dateToday = moment(new Date().setHours(8, 0, 0, 0)).format(
		"dddd, MMMM Do YYYY"
	);

	// Render
	res.render("main/add", {
		dateToday,
		flyingIcon: "fa-solid fa-list",
		pageToFlyTo: "/",
	});
});

// used for tasks and time
timesheetsRouter.post("/add", async (req, res, next) => {
	// Setting up object
	let newData = {};

	// Setting up today's date
	newData.day = moment(new Date().setHours(0, 0, 0, 0)); //year, month day, time, gmt+2

	// Setup new data
	if (req.body.from && req.body.to) {
		// Setup from
		let from = moment();
		req.body.from = Number(req.body.from);
		req.body.fromMin = Number(req.body.fromMin);
		if (req.body.fromAMPM == "AM" && req.body.from == 12) req.body.from = 0;
		if (req.body.fromAMPM == "PM" && req.body.from != 12) req.body.from += 12;
		from.hour(req.body.from);
		from.minute(req.body.fromMin);
		from.second(0);

		// Setup to
		let to = moment();
		req.body.to = Number(req.body.to);
		req.body.toMin = Number(req.body.toMin);
		if (req.body.toAMPM == "AM" && req.body.to == 12) req.body.to = 0;
		if (req.body.toAMPM == "PM" && req.body.to != 12) req.body.to += 12;
		to.hours(req.body.to);
		to.minute(req.body.toMin);
		to.second(0);

		// Setting time in object
		if (from.isBefore(to)) {
			newData.hoursWorked = [];
			newData.hoursWorked.push({ from, to });
		} else return next(new Error(`FROM needs to be before TO... bruv`));
	}

	// Setup tasks
	if (req.body.tasksDone) {
		newData.tasksDone = [req.body.tasksDone];
	}

	// Saving projects worked on
	if (req.body.projectsWorkedOn) {
		newData.projectsWorkedOn = [];
		newData.projectsWorkedOn.push(req.body.projectsWorkedOn);
	}

	// Find or add today's date
	findAddOrUpdate(newData)
		.then(() => {
			res.redirect("/");
		})
		.catch((err) => {
			next(err);
		});
});

//========================
//          Exports
//========================
module.exports = timesheetsRouter;
