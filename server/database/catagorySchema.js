const mongoose = require("mongoose");
mongoose.pluralize(null);

var catagorySchema = new mongoose.Schema({
	catagoryName: {
		type: String,
		unique: true,
	},

	subCatagory: [
		{
			subCatagoryName: {
				type: String,
				unique: true,
			},
		},
	],
});
var catagorySchema = mongoose.model("catagoryCollection", catagorySchema);
module.exports = catagorySchema;
