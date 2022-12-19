// ====================================
//             Requirements
// ====================================
const express = require("express");
const mainRouter = express.Router();
const dotenv = require("dotenv");
const moment = require("moment");

// Database
const DailyProgress = require("../database/dailyProgress");

// Helpers
const { findAddOrUpdate } = require("./helpers.js");

// ====================================
//             Configuration
// ====================================

// dotenv
dotenv.config({
	path: "./config/config.env", // Specifies dotenv
});

//========================
//          Main
//========================

mainRouter.get("/", (req, res, next) => {
	DailyProgress.find().then((data) => {
		res.render("main/list", {
			data,
			flyingIcon: "fa-solid fa-plus",
			pageToFlyTo: "/add",
		});
	});
});

mainRouter.get(["/add"], (req, res, next) => {
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

mainRouter.post("/add", async (req, res, next) => {
	// Setting up object
	let newData = {};

	// Setting up today's date
	newData.day = moment(); //year, month day, time, gmt+2

	// Setup new data
	if (req.body.from && req.body.to) {
		// Setup from
		let from = moment();
		req.body.from = Number(req.body.from);
		if (req.body.fromAMPM == "PM") req.body.from += 12;
		from.hour(req.body.from);
		from.minute(0);

		// Setup to
		let to = moment();
		req.body.to = Number(req.body.to);
		if (req.body.toAMPM == "PM") req.body.to += 12;
		to.hours(req.body.to);
		to.minute(0);

		// Setting time in object
		newData.hoursWorked = [];
		newData.hoursWorked.push({ from, to });
	}

	// Setup tasks
	if (req.body.tasksDone) {
		newData.tasksDone = [req.body.tasksDone];
	}

	// Find or add today's date
	findAddOrUpdate(newData)
		.then(() => {
			res.redirect("/add");
		})
		.catch((err) => {
			next(err);
		});
});

mainRouter.post("/add/tasks", async (req, res, next) => {
	// Setting up today's date
	let dateToday = new Date().setHours(0, 0, 0, 0);
});

//========================
//          Exports
//========================
module.exports = mainRouter;
