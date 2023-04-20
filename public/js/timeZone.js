const {
  allTimeZones,
  timeForOneCity,
  nextNhoursWeather,
} = require("weatherappsoliton");

process.on("message", (data) => {
  if (data.function === "timeForOneCity") {
    let city = data.cityName;
    let result = timeForOneCity(city);
    process.send(result);
    process.exit();
  } else if (data.function === "nextNhoursWeather") {
    let cityDetails = data.cityDTN;
    let hour = data.hours;
    let result = nextNhoursWeather(cityDetails, hour);
    process.send(result);
    process.exit();
  } else if (data.function === "allTimeZones") {
    let result = allTimeZones();
    process.send(result);
    process.exit();
  }
});
