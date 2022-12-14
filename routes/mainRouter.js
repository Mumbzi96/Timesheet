// ====================================
//             Requirements
// ====================================
const express = require("express");
const mainRouter = express.Router();
const dotenv = require("dotenv");
const moment = require("moment");

// Project Made Module
const DailyProgress = require("../database/dailyProgress");

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

mainRouter.get("/add", (req, res, next) => {
	res.render("main/add");
});

mainRouter.post("/add", async (req, res, next) => {
	let dateToday = new Date().setHours(0, 0, 0, 0);
	DailyProgress.findOne({ day: dateToday })
		.then((data) => {
			if (data == null) {
				let dailyProgress = new DailyProgress({
					day: dateToday,
				});
				dailyProgress
					.save()
					.then(() => {})
					.catch((err) => {
						next(err);
					});
				res.redirect("/add");
			} else res.redirect("/add");
		})
		.catch((err) => {
			next(err);
		});
	// dailyProgress
	// 	.save()
	// 	.then(() => {
	// 		res.redirect("/add");
	// 	})
	// 	.catch((err) => {
	// 		next(err);
	// 	});
});

//========================
//          Exports
//========================
module.exports = mainRouter;
