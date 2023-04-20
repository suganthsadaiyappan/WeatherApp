import { oneMinuteInterval } from "./utility.js";
import { getAllTimeZones } from "./httpRequest.js";

let timeData, cityTimeData;
const cardsDisplayLimit = 12;
const continentNameSort = document.querySelector(".continents-name-list");
const temperatureSort = document.querySelector(".continents-temp-list");
const continentNameSortIcon = document.querySelector(
  ".continents-name-list img"
);
const temperatureSortIcon = document.querySelector(".continents-temp-list img");
let continentsTimerId;

//Function to create a individual continent card
function createContinentCard(masterWeatherData) {
  cityTimeData = masterWeatherData.dateAndTime;
  timeData =
    cityTimeData.split(",")[1].split(":")[0] +
    ":" +
    cityTimeData.split(",")[1].split(":")[1] +
    " " +
    cityTimeData.split(",")[1].split(":")[2].split(" ")[1];
  // Create a div element with class "continents-card"
  const continentsCardDiv = document.createElement("div");
  continentsCardDiv.className = "continents-card";

  // Create a div element with class "continent-name-temp"
  const continentNameTempDiv = document.createElement("div");
  continentNameTempDiv.className = "continent-name-temp";

  // Create a paragraph element for continent name with class "font-weight-100"
  const continentNameParagraph = document.createElement("p");
  continentNameParagraph.className = "font-weight-100";
  continentNameParagraph.textContent = masterWeatherData.timeZone.split("/")[0];

  // Create a paragraph element for temperature with class "temperature font-weight-100"
  const temperatureParagraph = document.createElement("p");
  temperatureParagraph.className = "temperature font-weight-100";
  temperatureParagraph.textContent = masterWeatherData.temperature;

  // Append the continent name and temperature paragraphs to the "continent-name-temp" div
  continentNameTempDiv.appendChild(continentNameParagraph);
  continentNameTempDiv.appendChild(temperatureParagraph);

  // Create a div element with class "continent-city-time-humidity"
  const continentCityTimeHumidityDiv = document.createElement("div");
  continentCityTimeHumidityDiv.className = "continent-city-time-humidity";

  // Create a paragraph element for city and time with class "font-weight-100"
  const cityTimeParagraph = document.createElement("p");
  cityTimeParagraph.className = "font-weight-100";
  cityTimeParagraph.textContent = `${masterWeatherData.cityName}, ${timeData}`;

  // Create a paragraph element for humidity with class "font-weight-100" and an image element
  const humidityParagraph = document.createElement("p");
  humidityParagraph.className = "font-weight-100";
  humidityParagraph.innerHTML = `<img src="assets/WeatherIcons/humidityIcon.svg" alt="">${masterWeatherData.humidity}`;

  // Append the city and time and humidity paragraphs to the "continent-city-time-humidity" div
  continentCityTimeHumidityDiv.appendChild(cityTimeParagraph);
  continentCityTimeHumidityDiv.appendChild(humidityParagraph);

  // Append the "continent-name-temp" and "continent-city-time-humidity" divs to the "continents-card" div
  continentsCardDiv.appendChild(continentNameTempDiv);
  continentsCardDiv.appendChild(continentCityTimeHumidityDiv);

  // Add the "continents-card" div to the DOM or any desired parent element
  const parentElement = document.querySelector(".continents-card-container"); // Replace with the ID of the desired parent element
  parentElement.appendChild(continentsCardDiv);
}

//Function to remove all the continent cards
function removeContinentCards() {
  let continentsCard = document.querySelectorAll(".continents-card");
  for (let i = 0; i < continentsCard.length; i++) {
    continentsCard[i].remove();
  }
}

//Function to sort the continent cards based on the continent sort icon
function sortContinents(masterWeatherData, mode) {
  masterWeatherData.sort((a, b) => {
    const continentA = a.timeZone.split("/")[0];
    const continentB = b.timeZone.split("/")[0];
    if (mode === "Ascending") {
      if (continentA < continentB) {
        return -1;
      }
      if (continentA > continentB) {
        return 1;
      }
      return 0;
    } else {
      if (continentA < continentB) {
        return 1;
      }
      if (continentA > continentB) {
        return -1;
      }
      return 0;
    }
  });
}

//Function to sort the continent cards based on the temperature sort icon
function sortTemperature(masterWeatherData, temperatureMode, continentMode) {
  let continentSortOrder;
  masterWeatherData.sort((a, b) => {
    const temperatureA = Number(a.temperature.split("°C")[0]);
    const temperatureB = Number(b.temperature.split("°C")[0]);
    const continentA = a.timeZone.split("/")[0];
    const continentB = b.timeZone.split("/")[0];
    if (continentMode === "Ascending") {
      continentSortOrder = {
        Africa: 1,
        America: 2,
        Antartica: 3,
        Asia: 4,
        Australia: 5,
        Europe: 6,
        Pacific: 7,
      };
      const continentSortResult =
        continentSortOrder[continentA] - continentSortOrder[continentB];
      const temperatureA = parseInt(a.temperature);
      const temperatureB = parseInt(b.temperature);
      if (temperatureMode == "Ascending") {
        if (continentSortResult === 0) {
          return temperatureA - temperatureB;
        }
      } else {
        if (continentSortResult === 0) {
          return temperatureB - temperatureA;
        }
      }
      return continentSortResult;
    } else {
      continentSortOrder = {
        Africa: 7,
        America: 6,
        Antartica: 5,
        Asia: 4,
        Australia: 3,
        Europe: 2,
        Pacific: 1,
      };
      const continentSortResult =
        continentSortOrder[continentA] - continentSortOrder[continentB];
      const temperatureA = parseInt(a.temperature);
      const temperatureB = parseInt(b.temperature);
      if (temperatureMode == "Ascending") {
        if (continentSortResult === 0) {
          return temperatureA - temperatureB;
        }
      } else {
        if (continentSortResult === 0) {
          return temperatureB - temperatureA;
        }
      }
      return continentSortResult;
    }
  });
}

//Function to create,sort continent cards and handle event listeners for the sort icons
export async function setContinentCards(continentMode, temperatureMode) {
  const masterWeatherData = await getAllTimeZones();
  sortContinents(masterWeatherData, continentMode);
  sortTemperature(masterWeatherData, temperatureMode, continentMode);
  removeContinentCards();
  for (let i = 0; i < cardsDisplayLimit; i++) {
    createContinentCard(masterWeatherData[i]);
  }
  continentNameSort.addEventListener("click", async function () {
    const masterWeatherData = await getAllTimeZones();
    if (continentMode === "Ascending") {
      continentNameSortIcon.style.transform = "rotate(180deg)";
      continentMode = "Descending";
      sortContinents(masterWeatherData, continentMode);
      sortTemperature(masterWeatherData, temperatureMode, continentMode);
      removeContinentCards();
      for (let i = 0; i < cardsDisplayLimit; i++) {
        createContinentCard(masterWeatherData[i]);
      }
    } else if (continentMode === "Descending") {
      continentNameSortIcon.style.transform = "rotate(0deg)";
      continentMode = "Ascending";
      sortContinents(masterWeatherData, continentMode);
      sortTemperature(masterWeatherData, temperatureMode, continentMode);
      removeContinentCards();
      for (let i = 0; i < cardsDisplayLimit; i++) {
        createContinentCard(masterWeatherData[i]);
      }
    }
    setContinentCardsFunc(continentMode, temperatureMode);
  });
  temperatureSort.addEventListener("click", async function () {
    const masterWeatherData = await getAllTimeZones();
    if (temperatureMode === "Ascending") {
      temperatureSortIcon.style.transform = "rotate(180deg)";
      temperatureMode = "Descending";
      sortContinents(masterWeatherData, continentMode);
      sortTemperature(masterWeatherData, temperatureMode, continentMode);
      removeContinentCards();
      for (let i = 0; i < cardsDisplayLimit; i++) {
        createContinentCard(masterWeatherData[i]);
      }
    } else if (temperatureMode === "Descending") {
      temperatureSortIcon.style.transform = "rotate(0deg)";
      temperatureMode = "Ascending";
      sortContinents(masterWeatherData, continentMode);
      sortTemperature(masterWeatherData, temperatureMode, continentMode);
      removeContinentCards();
      for (let i = 0; i < cardsDisplayLimit; i++) {
        createContinentCard(masterWeatherData[i]);
      }
    }
    setContinentCardsFunc(continentMode, temperatureMode);
  });
  setContinentCardsFunc(continentMode, temperatureMode);
}

//Set interval function to render continent card data every minute
function setContinentCardsFunc(continentMode, temperatureMode) {
  clearInterval(continentsTimerId);
  continentsTimerId = setInterval(() => {
    setContinentCards(continentMode, temperatureMode);
  }, oneMinuteInterval);
}
