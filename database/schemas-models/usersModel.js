const { default: mongoose, Schema } = require("mongoose");

const userSchema = mongoose.Schema({
	fullName: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

const User = mongoose.model("User", userSchema);

//========================
//          Exports
//========================
module.exports = User;
