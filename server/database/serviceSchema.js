const mongoose = require("mongoose");
mongoose.pluralize(null);

var serviceSchema = new mongoose.Schema({
  selectedServiceCatagory: {
    type: String
  },
  selectedServiceSubCatagory: {
    type: String
  },
  serviceName: {
    type: String
  },
  servicePrice: {
    type: Number
  },
  serviceDescription: {
    type: String
  },
  serviceImage: {
    type: String
  }
});
var serviceSchema = mongoose.model("serviceCollection", serviceSchema);
module.exports = serviceSchema;
