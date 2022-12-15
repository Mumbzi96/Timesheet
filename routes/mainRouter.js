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
		res.send(data);
	});
});

mainRouter.get(["/add"], (req, res, next) => {
	res.render("main/add");
});

mainRouter.post("/add/hours", async (req, res, next) => {
	// Setting up object
	let newData = {};

	// Setting up today's date
	newData.day = dateToday = new Date().setHours(0, 0, 0, 0);

	// Setup new data
	if (req.body.from && req.body.to) {
		let from = new Date();
		from.setHours(req.body.from, 0, 0, 0);
		let to = new Date();
		to.setHours(req.body.to, 0, 0, 0);
		newData.hoursWorked = [];
		newData.hoursWorked.push({ from, to });
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
