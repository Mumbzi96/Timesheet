// ====================================
//             Requirements
// ====================================
const express = require("express");
const dotenv = require("dotenv");
const moment = require("moment");
const path = require("path");
let mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { MongoClient } = require("mongodb");

// Routes
const testRouter = require("./routes/testRouter");
const apiRouter = require("./routes/apiRouter");
const timesheetsRouter = require("./routes/timesheetsRouter");
const projectsRouter = require("./routes/projectsRouter");
const mainRouter = require("./routes/mainRouter");

// Project-made Modules
const hbs = require("./views/helpers/handlebarsHelper");

// ====================================
//             Configuration
// ====================================

// Init
const app = express();

// dotenv
dotenv.config({
	path: "./config/config.env", // Specifies dotenv
});

// session
app.use(
	session({
		secret: process.env.SESSION_PASSWORD,
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 32400000 }, // 32,400,000 is 9 hours in milliseconds}
		store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
	})
);

let PORT = process.env.PORT || 3000; // This uses the port from the configuration file or 3000 in case the file wasn't found

//handlebars
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

// Database
// mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URL).then(() => {
	console.log("connect");
});

// ====================================
//             Middleware
// ====================================

// Body parser
app.use(express.json()); //To use body parser for JSON
app.use(
	express.urlencoded({
		extended: true,
	})
);

// Logging - Runs on every page visit
app.use((req, res, next) => {
	console.log(`Used a ${req.method} method on ${req.url} at ${moment()} `);
	next();
});

// Static
app.use(express.static(path.join(__dirname, "/public")));
app.use(
	"/css",
	express.static(path.join(__dirname, "/public/bootstrap/dist/css"))
);
app.use(
	"/js",
	express.static(path.join(__dirname, "/public/bootstrap/dist/js"))
);

// Login middleware
let isLoggedIn = (req, res, next) => {
	if (req.session.isLoggedIn) next();
	else res.redirect("/login");
};

// ====================================
//             Routes
// ====================================

// Seperate Routes
app.use("/test", testRouter);
app.use("/api", apiRouter);
app.use("/", mainRouter);
app.use("/timesheets", isLoggedIn, timesheetsRouter);
app.use("/projects", isLoggedIn, projectsRouter);

// ====================================
//             Error Handling
// ====================================
app.use(async (err, req, res, next) => {
	console.log(err);
	res.render("main/other/errorHandler", {
		message: "An error has occured",
		err,
	});
});

// ====================================
//          Listening on ports
// ====================================

app.listen(PORT, () => {
	console.log(`Running on http://localhost:${PORT}`);
});
