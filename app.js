const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { fork } = require("child_process");

const app = express();
const port = process.env.port || 3000;

app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

app.get("/timeforonecity", function (req, res) {
  const child1 = fork("./public/js/timeZone.js");
  let city = req.query.city;
  if (city) {
    child1.send({ function: "timeForOneCity", cityName: city });
    child1.on("message", (result) => {
      res.json(result);
    });
  } else {
    res
      .status(404)
      .json({ Error: "Not a Valid Endpoint. Please check API Doc" });
  }
});

app.post("/hourly-forecast", function (req, res) {
  const child2 = fork("./public/js/timeZone.js");
  let cityDTN = req.body.city_Date_Time_Name;
  let hours = req.body.hours;
  if (cityDTN && hours) {
    child2.send({
      function: "nextNhoursWeather",
      cityDTN: req.body.city_Date_Time_Name,
      hours: req.body.hours,
    });
    child2.on("message", (result) => {
      res.json(result);
    });
  } else {
    res
      .status(404)
      .json({ Error: "Not a Valid Endpoint. Please check API Doc" });
  }
});

app.get("/all-timezone-cities", function (req, res) {
  const child3 = fork("./public/js/timeZone.js");
  child3.send({ function: "allTimeZones" });
  child3.on("message", (result) => {
    res.json(result);
  });
});

app.get("*", function (req, res) {
  res.status(404).sendFile(path.join(__dirname, "public/views/error404.html"));
});

app.listen(3000, function () {
  console.log(`Server listening on port ${port}.`);
});
