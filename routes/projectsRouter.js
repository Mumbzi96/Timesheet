// ====================================
//             Requirements
// ====================================
const express = require("express");
const projectsRouter = express.Router();

// Database
const Project = require("../database/schemas-models/projects");

//========================
//          Main
//========================

projectsRouter.get("/add", (req, res, next) => {
	let types = Project.schema.path("type").enumValues;
	res.render("main/projects/add", { types });
});

projectsRouter.post("/add", (req, res, next) => {
	let project = new Project(req.body);
	project
		.save()
		.then(() => {
			res.redirect("/projects");
		})
		.catch((err) => {
			next(err);
		});
});

//========================
//          Exports
//========================
module.exports = projectsRouter;
