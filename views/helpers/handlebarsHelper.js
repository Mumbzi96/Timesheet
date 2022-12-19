const handlebars = require("express-handlebars");
const moment = require("moment");

hbs = handlebars.create({
	defaultLayout: "main",
	runtimeOptions: {
		allowProtoPropertiesByDefault: true,
		allowProtoMethodsByDefault: true,
	},
	helpers: {
		isEqual: function (value, name) {
			if (value == name) {
				return true;
			} else {
				return false;
			}
		},
		calculateHours: function (hoursWorkedArr) {
			if (!hoursWorkedArr) return;
			
			let count = 0;
			
			for (i = 0; i < hoursWorkedArr.length; i++) {
				console.log("from " + moment(hoursWorkedArr.from).format("dddd, MMMM Do YYYY, hh:mm"))
				count += (hoursWorkedArr[i].to.getTime() - hoursWorkedArr[i].from.getTime())/1000; //this gets time in seconds
			}

			return count/3600;
		},
		presentTime: function (date) {
			if (!date) return;
			return moment(date).format("dddd, MMMM Do YYYY");
		},
	},
});

module.exports = hbs;
