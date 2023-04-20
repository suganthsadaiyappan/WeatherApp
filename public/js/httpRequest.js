import { cities } from "./utility.js";

const citiesArray = cities.map((city) => city.toLowerCase());

export async function getTimeForOneCity(cityName) {
  const index = citiesArray.indexOf(cityName);
  const city = cities[index];
  const url = `http://localhost:3000/timeforonecity?city=${city}`;
  const response = await fetch(url);
  const data = response.json();
  return data;
}

export async function nextNhoursWeather(cityTDN, hours) {
  const url = "http://localhost:3000/hourly-forecast";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      city_Date_Time_Name: `${cityTDN}`,
      hours: `${hours}`,
    }),
  });
  const data = response.json();
  return data;
}

export async function getAllTimeZones() {
  const url = "http://localhost:3000/all-timezone-cities";
  const response = await fetch(url);
  const data = response.json();
  return data;
}
