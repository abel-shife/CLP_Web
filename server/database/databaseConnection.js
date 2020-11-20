const mongoose = require("mongoose");
var url = "mongodb://127.0.0.1:27017/CLP_DB";

mongoose.connect(
	url,
	{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
	(err) => {
		if (!err) {
			console.log("Database connected");
		} else console.log(err);
	}
);

require("./adminSchema");
require("./serviceSchema");
require("./catagorySchema");
require("./purchasePointRuleSchema");
require("./offerSchema");
require("./branchSchema");
require("./eventSchema");
require("./otherPointRuleSchema");
require("./rewardSchema");
require("./levelSchema");
require("./clientSchema");
