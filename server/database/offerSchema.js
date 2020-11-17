const mongoose = require("mongoose");
mongoose.pluralize(null);

var offerSchema = new mongoose.Schema({
	offerTitle: String,
	serviceName: {
		type: String,
		unique: true,
	},
	servicePrice: Number,
	selectedLevel: String,
	selectedServiceCatagory: String,
	selectedServiceSubCatagory: String,
	serviceImage: String,
	discountPercent: Number,
	discountPrice: Number,
	numberOfPeople: Number,
	startDate: String,
	endDate: String,
	like: Number,
	dislike: Number,
	share: Number,
});
var offerSchema = mongoose.model("offerCollection", offerSchema);
module.exports = offerSchema;
