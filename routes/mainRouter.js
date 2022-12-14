// ====================================
//             Requirements
// ====================================
const express = require('express');
const mainRouter = express.Router();
const dotenv = require("dotenv");

// ====================================
//             Configuration
// ====================================

// dotenv
dotenv.config({
	path: "./config/config.env", // Specifies dotenv
});

//========================//
//          Main
//========================//

mainRouter.get('/add', (req, res, next) => {
	res.render('add');
});

//========================//
//          Exports
//========================//
module.exports = mainRouter;
