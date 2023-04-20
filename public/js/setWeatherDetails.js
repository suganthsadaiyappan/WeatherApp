import {
  cities,
  months,
  clock,
  oneHourInterval,
  oneSecondInterval,
  oneMinuteInterval,
} from "./utility.js";
import { setPreference } from "./setWeatherDetailsUserPreffered.js";
import { setContinentCards } from "./setContinentWeather.js";
import {
  getTimeForOneCity,
  nextNhoursWeather,
  getAllTimeZones,
} from "./httpRequest.js";

//UI elements populated based on the city selection
const cityIcon = document.querySelector(".city-icon > img");
const cityName = document.querySelector(".city-input > input");
const cityTime = document.querySelector(".city-time > .time");
const cityDate = document.querySelector(".city-time > .date");
const ampmState = document.querySelector(".ampmstate");
const cityinput = document.querySelector(".city-input");
const temperatureCelsius = document.querySelector(".city-temp-celsius > p");
const temperatureFahrenheit = document.querySelector(".city-temp-fahr > p");
const humidity = document.querySelector(".city-humidity > p");
const precipitation = document.querySelector(".city-precipitation > p");

//Load the city details the first time page is loaded
window.onload = (event) => {
  cityIcon.setAttribute(
    "src",
    `assets/Iconsforcities/${cityName.value.toLowerCase()}.svg`
  );
  setTimeDateForCity(cityName.value.toLowerCase());
  setWeather(cityName.value.toLowerCase());
  setFutureForecast(cityName.value.toLowerCase());
  setPreference();
  setContinentCards("Ascending", "Ascending");
};

//Function to add eventlistener to the dropdown to provide dynamic city time,date,icon and other details
export function citySelection(inp, arr) {
  let currentFocus;
  //Event listener on the input field to create autocomplete div elements
  inp.addEventListener("input", function (e) {
    let a,
      b,
      i,
      val = this.value;
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items font-weight-100");
    this.parentNode.appendChild(a);

    //For loop to generate autocomplete div elements containing with matching city names
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener("click", function (e) {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  // Event listener on the input field to change the city related details on enter. Throw error message when a invalid name is selected
  inp.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      let citiesArray = cities.map(function (item) {
        return item.toLowerCase();
      });
      let tempCityName = cityName.value.toLowerCase();
      if (citiesArray.includes(tempCityName)) {
        //Set city icon based on selection
        cityIcon.setAttribute(
          "src",
          `assets/Iconsforcities/${tempCityName}.svg`
        );
        //Call function to calculate time,date for the selected city
        setTimeDateForCity(tempCityName);
        //Call function to set the weather related details for the selected city
        setWeather(tempCityName);
        setFutureForecast(tempCityName);
      } else {
        alert("Please enter a valid city name");
      }
      closeAllLists(document.target);
    }
  });

  //Function to highlight the active element in the dropdown list
  inp.addEventListener("keydown", function (e) {
    let x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  //Supporting functions for adding and removing active element in the autocomplete dropdown list
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  //Supporting function to remove all autocomplete div elements
  function closeAllLists(elmnt) {
    let x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  //Event listener to close the autosuggestion window when clicked on screen
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
  //Event listener on the input field to choose the city and update city related details when clicked on input field
  cityinput.addEventListener("click", function (e) {
    let citiesArray = cities.map(function (item) {
      return item.toLowerCase();
    });
    let tempCityName = cityName.value.toLowerCase();
    if (!e.target.parentNode.classList.contains("city-input")) {
      if (citiesArray.includes(tempCityName)) {
        cityIcon.setAttribute(
          "src",
          `assets/Iconsforcities/${tempCityName}.svg`
        );
        setTimeDateForCity(tempCityName);
        setWeather(tempCityName);
        setFutureForecast(tempCityName);
      } else {
        alert("Please enter a valid city name");
      }
    }
  });
}

//Common setinterval function to handle updating of weather data based on city selection - implemented using closure
export function createIntervalTemplate(interval) {
  let timerId;
  return function (func, cityName) {
    clearInterval(timerId);
    timerId = setInterval(() => {
      func(cityName);
    }, interval);
  };
}

//Function to set the time,date,am/pm state based on the city selection
const setTimeDateForCityFunc = createIntervalTemplate(oneMinuteInterval);
async function setTimeDateForCity(cityName) {
  let cityTimeData = await getTimeForOneCity(cityName);
  cityTimeData = cityTimeData.city_Date_Time_Name;
  let day = cityTimeData.split(",")[0].split("/")[1];
  let monthvalue = cityTimeData.split(",")[0].split("/")[0];
  let year = cityTimeData.split(",")[0].split("/")[2];
  let hour = cityTimeData.split(",")[1].split(" ")[1].split(":")[0];
  let minute = cityTimeData.split(",")[1].split(" ")[1].split(":")[1];
  let seconds = cityTimeData.split(",")[1].split(" ")[1].split(":")[2];
  let month = months[Number(monthvalue) - 1];
  cityDate.textContent = day + "-" + month + "-" + year;
  cityTime.innerHTML =
    hour + ":" + minute + ":" + `<span class=\"seconds\">${seconds}</span>`;
  if (cityTimeData.split(",")[1].split(" ")[2] === "AM") {
    ampmState.setAttribute("src", "assets/GeneralImagesIcons/amState.svg");
  } else {
    ampmState.setAttribute("src", "assets/GeneralImagesIcons/pmState.svg");
  }
  setTimeDateForCityFunc(setTimeDateForCity, cityName);
}

//Function to set weather related details based on the selected city
const setWeatherFunc = createIntervalTemplate(oneHourInterval);
async function setWeather(cityName) {
  //Calling the function allTimeZones and storing the response, filter the data based on the city name
  const weatherData = await getAllTimeZones();
  const cityWeatherData = weatherData.filter(
    (data) => data.cityName.toLowerCase() === cityName
  );
  //Update the weather information based on the response data
  temperatureCelsius.innerHTML =
    cityWeatherData[0].temperature.split("°C")[0] + " C";
  humidity.innerHTML = cityWeatherData[0].humidity.split("%")[0];
  precipitation.innerHTML = cityWeatherData[0].precipitation.split("%")[0];
  temperatureFahrenheit.innerHTML =
    (
      Number(cityWeatherData[0].temperature.split("°C")[0]) * (9 / 5) +
      32
    ).toFixed() + " F";
  setWeatherFunc(setWeather, cityName);
}

//Function to set the future forecast for next 5 hours
let hour, amPmState, currentTime, clockIndex;
let timeContainer = [];
let timeTemperature = [];
let temperatureIcons = [];
const setFutureForecastFunc = createIntervalTemplate(oneHourInterval);
async function setFutureForecast(cityName) {
  // Calling the nextNhoursWeather function and storing the response
  let cityTimeData = await getTimeForOneCity(cityName);
  cityTimeData = cityTimeData.city_Date_Time_Name;
  const futureForecast = await nextNhoursWeather(cityTimeData, 5);
  hour = cityTimeData.split(",")[1].split(" ")[1].split(":")[0];
  amPmState = cityTimeData.split(",")[1].split(" ")[2];
  currentTime = hour + " " + amPmState;
  clockIndex = clock.findIndex((item) => item === currentTime);
  //Set time,temperature,icon in the future forecast bar for future time period
  for (let i = 0; i < 6; i++) {
    if (i == 0) {
      timeTemperature[0] = document.querySelector(`.time-temp-${i}`);
      timeTemperature[0].innerHTML =
        temperatureCelsius.textContent.split(" ")[0];
      temperatureIcons[0] = document.querySelector(`.time-icons-0 > img`);
    } else {
      timeContainer[i] = document.querySelector(`.time-${i}`);
      timeContainer[i].innerHTML = clock[(clockIndex + 1) % 24];
      timeTemperature[i] = document.querySelector(`.time-temp-${i}`);
      timeTemperature[i].innerHTML =
        futureForecast.temperature[i - 1].split("°C")[0];
      temperatureIcons[i] = document.querySelector(`.time-icons-${i} > img`);
      clockIndex++;
    }

    if (Number(timeTemperature[i].innerHTML) < 18) {
      temperatureIcons[i].setAttribute(
        "src",
        "assets/WeatherIcons/rainyIcon.svg"
      );
    } else if (
      Number(timeTemperature[i].innerHTML) >= 18 &&
      Number(timeTemperature[i].innerHTML) <= 22
    ) {
      temperatureIcons[i].setAttribute(
        "src",
        "assets/WeatherIcons/windyIcon.svg"
      );
    } else if (
      Number(timeTemperature[i].innerHTML) >= 23 &&
      Number(timeTemperature[i].innerHTML) <= 29
    ) {
      temperatureIcons[i].setAttribute(
        "src",
        "assets/WeatherIcons/cloudyIcon.svg"
      );
    } else {
      temperatureIcons[i].setAttribute(
        "src",
        "assets/WeatherIcons/sunnyIcon.svg"
      );
    }
  }
  setFutureForecastFunc(setFutureForecast, cityName);
}
