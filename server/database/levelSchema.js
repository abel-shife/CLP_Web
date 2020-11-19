const mongoose = require("mongoose");
mongoose.pluralize(null);

var levelSchema = new mongoose.Schema({
	levelName: { type: String, unique: true },
	levelDescription: String,
	maximumRange: Number,
	minimumRange: Number,
	noCustomers: Number,
});
var levelSchema = mongoose.model("levelCollection", levelSchema);
module.exports = levelSchema;
