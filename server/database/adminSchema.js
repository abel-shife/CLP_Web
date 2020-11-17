const { boolean, bool } = require("joi");
const mongoose = require("mongoose");
mongoose.pluralize(null);

var adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: String,
    unique: true,
  },
  address: {
    type: String,
  },
  adminUserName: {
    type: String,
    unique: true,
  },
  adminPassword: {
    type: String,
  },
  actor: { type: String },
  adminPicture: {
    type: String,
  },
  adminAssigned: { type: Boolean },
  assignedTo: { type: String },
});
var adminSchema = mongoose.model("adminCollection", adminSchema);
module.exports = adminSchema;
