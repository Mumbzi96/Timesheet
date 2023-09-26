// ====================================
//             Requirements
// ====================================
const express = require("express");
const mainRouter = express.Router();
const dotenv = require("dotenv");
const moment = require("moment");
const bcrypt = require("bcryptjs");

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
//========================
//          Login
//========================

mainRouter.get(["/", "/login"], (req, res, next) => {
	//
	if (req.session.isLoggedIn) return res.redirect("/timesheets");
	
	//
	res.render("main/other/login", {
		layout: "login",
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
					res.redirect("/timesheets");
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
	} else {
		next(new Error("user not found"));
	}
});

mainRouter.get("/logout", (req, res, next) => {
	req.session.destroy();
	res.redirect("/login");
});

//========================
//          Exports
//========================
module.exports = mainRouter;
