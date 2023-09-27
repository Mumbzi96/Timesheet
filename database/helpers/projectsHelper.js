// ====================================
//             Requirements
// ====================================
const { default: mongoose } = require("mongoose");
const Project = require("../schemas-models/projects");
const dotenv = require("dotenv");

//========================
//          Configuration
//========================
// dotenv
dotenv.config({
	path: "./config/config.env", // Specifies dotenv
});

//========================
//          Main
//========================
let checkProjects = async () => {
	// Counting Projects
	let numberOfProjects = await Project.count({});

	// If no users exist, this is a dummy one
	if (numberOfProjects == 0) {
		let projects = [
			new Project({ name: "Godot", type: "Learning" }),
			new Project({ name: "Timesheets App", type: "Web System" }),
		];
		Project.insertMany(projects)
			.then(() => {
				console.log("Default projects have been added");
			})
			.catch((err) => {
				console.log(err);
			});
	}
};

//========================//
//          Exports
//========================//
module.exports = { checkProjects };
