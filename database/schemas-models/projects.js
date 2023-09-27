const { default: mongoose, Schema } = require("mongoose");

const projectsSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
		enum: ["Web System", "Game", "Research", "Learning"],
	},
});

const Project = mongoose.model("Project", projectsSchema);

//========================
//          Exports
//========================
module.exports = Project;
