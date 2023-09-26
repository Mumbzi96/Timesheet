// ====================================
//             Requirements
// ====================================
const { default: mongoose } = require("mongoose");
const User = require("../schemas-models/usersModel");
const bcrypt = require("bcryptjs");
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
let checkUsers = async () => {
	// Counting Companies
	let numberOfUsers = await User.count({});

	// Hashing password
	let _password = await bcrypt
		.hash(process.env.SYSTEM_ADMIN_PASSWORD, 10)
		.then((hash) => {
			return hash;
		})
		.catch((err) => {
			console.log(err);
		});

	// If no users exist, this is a dummy one
	if (numberOfUsers == 0) {
		let user = new User({
			fullName: "System Administrator",
			username: "admin",
			email: process.env.SYSTEM_ADMIN_EMAIL,
			password: _password,
		});
		user.save();
	}
};

//========================//
//          Exports
//========================//
module.exports = { checkUsers };
