const mongoose = require("mongoose");
mongoose.pluralize(null);

var branchSchema = new mongoose.Schema({
  branchName: { type: String },
  branchCity: { type: String },
  branchRegion: { type: String },
  branchTelephone: {
    type: String,
    unique: true,
  },
  branchAdminId: { type: String },
});
var branchSchema = mongoose.model("branchCollection", branchSchema);
module.exports = branchSchema;
