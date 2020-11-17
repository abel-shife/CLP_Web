const mongoose = require("mongoose");
mongoose.pluralize(null);

var supperAdminSchema = new mongoose.Schema({
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
  actor:{
    type:String
  },
  adminPicture: {
    type: String,
  },
});
var supperAdminSchema = mongoose.model(
  "supperAdminCollection",
  supperAdminSchema
);
module.exports = supperAdminSchema;
