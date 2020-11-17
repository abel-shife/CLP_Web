require("./database/databaseConnection");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const config = require("./config/config");

const app = express();

app.use(bodyParser.json());
app.use(cors());

require("./passportAuth/passportAuthentication");
require("./routes/serverRoute")(app);
app.listen(config.port);
console.log(`Server started on port ${config.port}`);

// event    ======     {
//     "_id" : ObjectId("5f7768124265621b58f53221"),
//     "eventName" : "the night",
//     "level" : "All",
//     "eventBranch" : "abema",
//     "eventTime" : "12:00",
//     "eventDate" : ISODate("2020-10-02T00:00:00.000Z"),
//     "eventDescription" : "jhdfbvjhdfbvjh jhdfbvjhdfbvjh jhdfbvjhdfbvjh v jhdfbvjhdfbvjh jhdfbvjhdfbvjhjhdfbvjhdfbvjh end",
//     "numberofPeople" : 50,
//     "eventImage" : "img-1601660946640.jpg",
//      "like":number,
//      "dislike":number,
//     "__v" : 0
// }

// offer======= {
//     "_id" : ObjectId("5f7767574265621b58f5321f"),
//     "selectedServiceName" : "bread Cru",
//     "selectedServiceSubCatagory" : "breakfast",
//     "selectedServiceCatagory" : "Food",
//     "servicePrice" : 12.3,
//     "offerTitle" : "the great offer",
//     "startDate" : ISODate("2020-10-02T00:00:00.000Z"),
//     "endDate" : ISODate("2020-10-24T00:00:00.000Z"),
//     "selectedLevel" : "All",
//     "discountPrice" : 1.23,
//     "discountPercent" : 10,
//     "numberofPeople" : 19,
//     "__v" : 0
// }
