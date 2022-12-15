// ====================================
//             Requirements
// ====================================
const express = require("express");
const mainRouter = express.Router();
const dotenv = require("dotenv");
const moment = require("moment");

// Project Made Module
const DailyProgress = require("../database/dailyProgress");
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

mainRouter.get(["/", "/add"], (req, res, next) => {
	res.render("main/add");
});

mainRouter.post("/add", async (req, res, next) => {
	// Setting up today's date
	let dateToday = new Date().setHours(0, 0, 0, 0);

	// Setup new data
	let newData = {
		day: dateToday,
		hoursWorked: { from: req.body.from, to: req.body.to },
	};

	// Find or add today's date
	findAddOrUpdate(newData).then(() => {
		res.redirect("/add");
	});
});

//========================
//          Exports
//========================
module.exports = mainRouter;
