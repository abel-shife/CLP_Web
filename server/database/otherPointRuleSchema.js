const mongoose = require("mongoose");
mongoose.pluralize(null);

var otherPointRuleSchema = new mongoose.Schema({
	cause: { type: String, unique: true },

	point: Number,
});
var otherPointRuleSchema = mongoose.model(
	"otherPointRuleCollection",
	otherPointRuleSchema
);
module.exports = otherPointRuleSchema;
