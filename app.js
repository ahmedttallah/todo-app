// Packages
const express = require("express");
const http = require("http");
const helmet = require("helmet");
const logger = require("morgan");
const cors = require("cors");
const hpp = require("hpp");
const xss = require("xss-clean");
const bodyParser = require("body-parser");
const chalk = require("chalk");

// Project Dependencies
const { mongoConnection } = require("./mongo");


// ENV Variables
require("dotenv").config();

// Create Server
const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());

app.use(logger("dev"));

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Prevent Http param pollution
app.use(hpp());

// Prevent XSS attacks
app.use(xss());

// MongoDB Connection
mongoConnection();

// Expose User Images
app.use(express.static(__dirname + "/public"));

// Routes
app.use("/api/v1", require("./routes"));

// Listening
const PORT = process.env.PORT;
server.listen(
  PORT,
  console.log(chalk.bgGreen.bold(`[OK] Listening on http://localhost:${PORT} `))
);
