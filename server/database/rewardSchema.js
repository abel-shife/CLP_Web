const mongoose = require("mongoose");
mongoose.pluralize(null);

var rewardSchema = new mongoose.Schema({
	rewardName: { type: String, unique: true },
	rewardDescription: String,
	minPoint: Number,
	level: String,
	expiryDate: String,
});
var rewardSchema = mongoose.model("rewardCollection", rewardSchema);
module.exports = rewardSchema;
