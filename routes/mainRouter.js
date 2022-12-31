// ====================================
//             Requirements
// ====================================
const express = require("express");
const mainRouter = express.Router();
const dotenv = require("dotenv");
const moment = require("moment");
const bcrypt = require("bcrypt");

// Database
const DailyProgress = require("../database/dailyProgress");
const User = require("../database/schemas-models/usersModel");

// Helpers
const { findAddOrUpdate } = require("./helpers.js");
const { checkUsers } = require("../database/helpers/usersHelper");

// ====================================
//             Configuration
// ====================================

// dotenv
dotenv.config({
	path: "./config/config.env", // Specifies dotenv
});

// Check if any users exist
checkUsers();

// ====================================
//             Middleware
// ====================================
let IsLoggedIn = (req, res, next) => {
	if (req.session.isLoggedIn) next();
	else res.redirect("/login");
};

//========================
//          View
//========================

mainRouter.get("/", IsLoggedIn, (req, res, next) => {
	DailyProgress.find().then((data) => {
		res.render("main/list", {
			data,
			flyingIcon: "fa-solid fa-plus",
			pageToFlyTo: "/add",
		});
	});
});

//========================
//          Login
//========================

mainRouter.get("/login", (req, res, next) => {
	DailyProgress.find().then((data) => {
		res.render("main/other/login", {
			layout: "login",
		});
	});
});

mainRouter.post("/login", async (req, res, next) => {
	// Get data submitted from form
	let _username = req.body.username;
	let _password = req.body.password;
	// Find user in database
	let userDB = await User.findOne({ username: _username }).exec();

	// Check password of username exists
	if (userDB) {
		bcrypt
			.compare(_password, userDB.password)
			.then((isCorrect) => {
				// Check password
				if (isCorrect) {
					req.session.isLoggedIn = true;
					req.session.user = userDB;
					res.redirect("/");
				} else {
					console.log("wrong");
					res.render("main/other/login", {
						err: "Username and/or password are incorrect",
					});
				}
			})
			.catch((err) => {
				console.log(err);
				next(err);
			});
	}
});

mainRouter.get("/logout", (req, res, next) => {
	req.session.destroy();
	res.redirect("/login");
});

//========================
//          Add
//========================

mainRouter.get(["/add"], IsLoggedIn, (req, res, next) => {
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
mainRouter.post("/add", IsLoggedIn, async (req, res, next) => {
	// Setting up object
	let newData = {};

	// Setting up today's date
	newData.day = moment(new Date().setHours(0, 0, 0, 0)); //year, month day, time, gmt+2

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
			res.redirect("/");
		})
		.catch((err) => {
			next(err);
		});
});

//========================
//          Exports
//========================
module.exports = mainRouter;
