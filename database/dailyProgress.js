// ====================================
//             Requirements
// ====================================
const express = require("express");
let mongoose = require("mongoose");

//========================
//          Main
//========================
const dailyProgressSchema = new mongoose.Schema({
	day: Date,
	hoursWorked: [{ from: Date, to: Date }],
	tasksDone: [String],
	projectsWorkedOn: [String],
});

const DailyProgress = mongoose.model("DailyProgress", dailyProgressSchema);

//========================
//          Exports
//========================
module.exports = DailyProgress;
