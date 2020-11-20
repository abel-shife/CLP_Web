require("./database/databaseConnection");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const config = require("./config/config");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(cors());

require("./passportAuth/passportAuthentication");
require("./routes/serverRoute")(app);
app.listen(config.port);
console.log(`Server started on port ${config.port}`);
