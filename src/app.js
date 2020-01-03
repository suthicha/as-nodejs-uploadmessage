const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");


const uploadRoute = require('./routes/upload');

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "1mb", extended: false }));
app.use(bodyParser.json({ limit: "1mb" }));
app.use("/upload", express.static(path.join("src/upload")));

app.use("/api/upload", uploadRoute);

module.exports = app;
