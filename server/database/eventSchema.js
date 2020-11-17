const mongoose = require("mongoose");
mongoose.pluralize(null);

var eventSchema = new mongoose.Schema({
	eventTitle: {
		type: String,
		unique: true,
	},
	eventDescription: String,
	eventImage: String,
	eventDate: String,
	eventStartTime: String,
	selectedLevel: String,
	numberOfPeople: Number,
	eventBranch: String,
	like: Number,
	dislike: Number,
	share: Number,
});
var eventSchema = mongoose.model("eventCollection", eventSchema);
module.exports = eventSchema;
