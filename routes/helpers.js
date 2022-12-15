// ====================================
//             Requirements
// ====================================
const express = require("express");
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

let findAddOrUpdate = async (newData) => {
	return new Promise((res, rej) => {
		DailyProgress.findOne({ day: newData.day })
			.then(async (data) => {
				// If data is null, create and save new one
				if (data == null) {
					saveProgress(newData)
						.then((answer) => {
							res(answer);
						})
						.catch((err) => {
							rej(err);
						});
					// if data is found, update
				} else
					updateProgress((existingData = data), newData)
						.then((answer) => {
							res(answer);
						})
						.catch((err) => {
							rej(err);
						});
			})
			.catch((err) => {
				rej(err);
			});
	});
};

let saveProgress = async (newData) => {
	return new Promise((res, rej) => {
		let dailyProgress = new DailyProgress(newData);
		dailyProgress
			.save()
			.then(() => {
				res("saved");
			})
			.catch((err) => {
				// rej("err occured while saving new data");
				rej(err);
			});
	});
};

let updateProgress = async (existingData, newData) => {
	return new Promise((res, rej) => {
		// if saving array of hours worked
		if (newData.hoursWorked.length != 0) {
			existingData.hoursWorked = existingData.hoursWorked.concat(
				newData.hoursWorked
			);
		}
		existingData
			.save()
			.then(() => {
				res(true);
			})
			.catch((err) => {
				// rej("error occured while updating existing document");
				rej(err);
			});
	});
};

//========================
//          Exports
//========================
module.exports = { findAddOrUpdate };
