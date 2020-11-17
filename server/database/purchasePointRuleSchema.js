const mongoose = require("mongoose");
mongoose.pluralize(null);

var purchasePointRuleSchema = new mongoose.Schema({
	serviceName: {
		type: String,
		unique: true,
	},
	servicePrice: Number,
	point: Number,
});
var purchasePointRuleSchema = mongoose.model(
	"purchasePointRuleCollection",
	purchasePointRuleSchema
);
module.exports = purchasePointRuleSchema;
