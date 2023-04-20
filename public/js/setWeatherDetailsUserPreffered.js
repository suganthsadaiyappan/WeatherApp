import { months, oneMinuteInterval, sortData, clearTimers } from "./utility.js";
import { getAllTimeZones } from "./httpRequest.js";

const cardContainer = document.querySelector(".card-container");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
const sunnyIcon = document.querySelector(".preferences-icons > a:nth-child(1)");
const snowFlakeIcon = document.querySelector(
  ".preferences-icons > a:nth-child(2)"
);
const rainyIcon = document.querySelector(".preferences-icons > a:nth-child(3)");
const initialTopCards = 4;

//Function to create a card based on the weather data
function setCardDetails(masterWeatherData) {
  let day, month, year, dateData, timeData, weatherIcon;
  //Calculation of Date from weatherdata
  day = masterWeatherData.dateAndTime.split(",")[0].split("/")[1];
  month =
    months[
      Number(masterWeatherData.dateAndTime.split(",")[0].split("/")[0]) - 1
    ];
  year = masterWeatherData.dateAndTime.split(",")[0].split("/")[2];
  dateData = day + "-" + month + "-" + year;

  //Calculation of time for the city from weather data
  let cityTimeData = masterWeatherData.dateAndTime;
  timeData =
    cityTimeData.split(",")[1].split(":")[0] +
    ":" +
    cityTimeData.split(",")[1].split(":")[1] +
    " " +
    cityTimeData.split(",")[1].split(":")[2].split(" ")[1];

  //Set icon
  if (
    Number(masterWeatherData.temperature.split("°C")[0]) > 29 &&
    Number(masterWeatherData.humidity.split("%")[0]) < 50 &&
    Number(masterWeatherData.precipitation.split("%")[0]) >= 50
  ) {
    weatherIcon = "assets/WeatherIcons/sunnyIcon.svg";
  } else if (
    Number(masterWeatherData.temperature.split("°C")[0]) >= 20 &&
    Number(masterWeatherData.temperature.split("°C")[0]) <= 28 &&
    Number(masterWeatherData.humidity.split("%")[0]) > 50 &&
    Number(masterWeatherData.precipitation.split("%")[0]) < 50
  ) {
    weatherIcon = "assets/WeatherIcons/snowflakeIcon.svg";
  } else if (
    Number(masterWeatherData.temperature.split("°C")[0]) < 20 &&
    Number(masterWeatherData.humidity.split("%")[0]) >= 50
  ) {
    weatherIcon = "assets/WeatherIcons/rainyIcon.svg";
  }

  let cardDetails = document.createElement("div");
  cardDetails.className = "card-details";
  cardDetails.style.backgroundImage = `url("../assets/Iconsforcities/${masterWeatherData.cityName}.svg")`;

  // Create card-title div container
  let cardTitle = document.createElement("div");
  cardTitle.className = "card-title";

  // Create card-city-name div element
  let cityName = document.createElement("div");
  cityName.className = "card-city-name font-weight-500";
  cityName.textContent = masterWeatherData.cityName;
  cardTitle.appendChild(cityName);

  // Create card-temp div element
  let cardTemp = document.createElement("div");
  cardTemp.className = "card-temp font-weight-100";
  cardTemp.innerHTML = `<img src=${weatherIcon} alt="" />${masterWeatherData.temperature}`;
  cardTitle.appendChild(cardTemp);

  cardDetails.appendChild(cardTitle);

  // Create card-city-details div container
  let cardCityDetails = document.createElement("div");
  cardCityDetails.className = "card-city-details";

  // Create time div element
  let time = document.createElement("div");
  time.className = "time font-weight-100";
  time.textContent = timeData;
  cardCityDetails.appendChild(time);

  // Create date div element
  let date = document.createElement("div");
  date.className = "date font-weight-100";
  date.textContent = dateData;
  cardCityDetails.appendChild(date);

  // Create humidity div element
  let humidity = document.createElement("div");
  humidity.className = "humidity font-weight-100";
  humidity.innerHTML = `<img src="assets/WeatherIcons/humidityIcon.svg" alt=""> ${masterWeatherData.humidity}`;
  cardCityDetails.appendChild(humidity);

  // Create precipitation div element
  let precipitation = document.createElement("div");
  precipitation.className = "precipitation font-weight-100";
  precipitation.innerHTML = `<img src="assets/WeatherIcons/precipitationIcon.svg" alt=""> ${masterWeatherData.precipitation}`;
  cardCityDetails.appendChild(precipitation);

  cardDetails.appendChild(cardCityDetails);

  // Append card-details div container to the DOM
  let container = document.querySelector(".card-container"); // Assuming you have a container element in your HTML
  container.appendChild(cardDetails);
}

//Function to update the cards
function updateCardDetails(preference) {
  if (preference === "Sunny") {
    sunnyIcon.click();
  } else if (preference === "Rainy") {
    rainyIcon.click();
  } else if (preference === "Snowy") {
    snowFlakeIcon.click();
  }
}
//function to remove existing cards on re-render
function removeCardDetails() {
  let cardDetails = document.querySelectorAll(".card-details");
  for (let i = 0; i < cardDetails.length; i++) {
    cardDetails[i].remove();
  }
}

//Functionality to filter city cards based on preference icons
export async function setPreference() {
  const sunnyIcon = document.querySelector(
    ".preferences-icons > a:nth-child(1)"
  );
  const snowFlakeIcon = document.querySelector(
    ".preferences-icons > a:nth-child(2)"
  );
  const rainyIcon = document.querySelector(
    ".preferences-icons > a:nth-child(3)"
  );
  const displayNumber = document.querySelector(".preferences-icons > input");
  const masterWeatherData = await getAllTimeZones();
  let weatherArray = [];
  let currentDisplayCount = 4;
  let sunnyTimerId, snowyTimerId, rainyTimerId;

  //Functionality to display the top  'n' number of cities based on the selected number
  displayNumber.addEventListener("change", function (e) {
    if (e.target.value <= 3) {
      e.target.value = 3;
    } else if (e.target.value >= 10) {
      e.target.value = 10;
    }
    currentDisplayCount = e.target.value;
    if (sunnyIcon.className === "active") {
      sunnyIcon.click();
    } else if (rainyIcon.className === "active") {
      rainyIcon.click();
    } else {
      snowFlakeIcon.click();
    }
  });

  //Load maximum of 4 sunny cities initially
  for (let i = 0; i < masterWeatherData.length; i++) {
    if (
      Number(masterWeatherData[i].temperature.split("°C")[0]) > 29 &&
      Number(masterWeatherData[i].humidity.split("%")[0]) < 50 &&
      Number(masterWeatherData[i].precipitation.split("%")[0]) >= 50
    ) {
      weatherArray.push(masterWeatherData[i]);
    }
  }
  sortData(weatherArray, "Sunny");
  for (let i = 0; i < Math.min(weatherArray.length, initialTopCards); i++) {
    setCardDetails(weatherArray[i]);
  }
  clearTimers(sunnyTimerId, rainyTimerId, snowyTimerId);
  sunnyTimerId = setInterval(() => {
    updateCardDetails("Sunny");
  }, oneMinuteInterval);
  weatherArray = [];

  //IIFE function to hide/unhide the arrows based on the container overflow when page renders initially
  (function () {
    if (cardContainer.scrollWidth > cardContainer.clientWidth) {
      leftArrow.style.visibility = "visible";
      rightArrow.style.visibility = "visible";
    } else {
      leftArrow.style.visibility = "hidden";
      rightArrow.style.visibility = "hidden";
    }
  })();

  //Function to hide/unhide slider arrows
  function hideArrows() {
    if (cardContainer.scrollWidth > cardContainer.clientWidth) {
      leftArrow.style.visibility = "visible";
      rightArrow.style.visibility = "visible";
    } else {
      leftArrow.style.visibility = "hidden";
      rightArrow.style.visibility = "hidden";
    }
  }

  //Event listener to hide/unhide arrow buttons based on container overflow during each resize event
  window.addEventListener("resize", function () {
    if (cardContainer.scrollWidth > cardContainer.clientWidth) {
      leftArrow.style.visibility = "visible";
      rightArrow.style.visibility = "visible";
    } else {
      leftArrow.style.visibility = "hidden";
      rightArrow.style.visibility = "hidden";
    }
  });

  //Eventlistener to handle scroll behaviour
  leftArrow.addEventListener("click", function (event) {
    cardContainer.scrollLeft -= cardContainer.offsetWidth;
    event.preventDefault();
  });

  rightArrow.addEventListener("click", function (event) {
    cardContainer.scrollLeft += cardContainer.offsetWidth;
    event.preventDefault();
  });

  //Function to display city cards for sunny cities
  sunnyIcon.addEventListener("click", async function () {
    const masterWeatherData = await getAllTimeZones();
    if (sunnyIcon.className === "") {
      sunnyIcon.classList.toggle("active");
    }
    removeCardDetails();
    for (let i = 0; i < masterWeatherData.length; i++) {
      if (
        Number(masterWeatherData[i].temperature.split("°C")[0]) > 29 &&
        Number(masterWeatherData[i].humidity.split("%")[0]) < 50 &&
        Number(masterWeatherData[i].precipitation.split("%")[0]) >= 50
      ) {
        weatherArray.push(masterWeatherData[i]);
      }
    }
    sortData(weatherArray, "Sunny");
    for (
      let i = 0;
      i < Math.min(currentDisplayCount, weatherArray.length);
      i++
    ) {
      setCardDetails(weatherArray[i]);
    }
    hideArrows();
    clearTimers(sunnyTimerId, rainyTimerId, snowyTimerId);
    sunnyTimerId = setInterval(() => {
      updateCardDetails("Sunny");
    }, oneMinuteInterval);
    weatherArray = [];
    if (snowFlakeIcon.className === "active") {
      snowFlakeIcon.classList.toggle("active");
    } else if (rainyIcon.className === "active") {
      rainyIcon.classList.toggle("active");
    }
  });

  //Function to display city cards for rainy cities
  rainyIcon.addEventListener("click", async function () {
    const masterWeatherData = await getAllTimeZones();
    if (rainyIcon.className !== "active") {
      rainyIcon.classList.toggle("active");
    }
    removeCardDetails();
    for (let i = 0; i < masterWeatherData.length; i++) {
      if (
        Number(masterWeatherData[i].temperature.split("°C")[0]) < 20 &&
        Number(masterWeatherData[i].humidity.split("%")[0]) >= 50
      ) {
        weatherArray.push(masterWeatherData[i]);
      }
    }
    sortData(weatherArray, "Rainy");
    for (
      let i = 0;
      i < Math.min(currentDisplayCount, weatherArray.length);
      i++
    ) {
      setCardDetails(weatherArray[i]);
    }
    hideArrows();
    clearTimers(sunnyTimerId, rainyTimerId, snowyTimerId);
    rainyTimerId = setInterval(() => {
      updateCardDetails("Rainy");
    }, oneMinuteInterval);
    weatherArray = [];
    if (snowFlakeIcon.className === "active") {
      snowFlakeIcon.classList.toggle("active");
    } else if (sunnyIcon.className === "active") {
      sunnyIcon.classList.toggle("active");
    }
  });

  //Function to display city cards for snowy cities
  snowFlakeIcon.addEventListener("click", async function () {
    const masterWeatherData = await getAllTimeZones();
    if (snowFlakeIcon.className !== "active") {
      snowFlakeIcon.classList.toggle("active");
    }
    removeCardDetails();
    for (let i = 0; i < masterWeatherData.length; i++) {
      if (
        Number(masterWeatherData[i].temperature.split("°C")[0]) >= 20 &&
        Number(masterWeatherData[i].temperature.split("°C")[0]) <= 28 &&
        Number(masterWeatherData[i].humidity.split("%")[0]) > 50 &&
        Number(masterWeatherData[i].precipitation.split("%")[0]) < 50
      ) {
        weatherArray.push(masterWeatherData[i]);
      }
    }
    sortData(weatherArray, "Snowy");
    for (
      let i = 0;
      i < Math.min(currentDisplayCount, weatherArray.length);
      i++
    ) {
      setCardDetails(weatherArray[i]);
    }
    hideArrows();
    clearTimers(sunnyTimerId, rainyTimerId, snowyTimerId);
    snowyTimerId = setInterval(() => {
      updateCardDetails("Snowy");
    }, oneMinuteInterval);
    weatherArray = [];
    if (rainyIcon.className === "active") {
      rainyIcon.classList.toggle("active");
    } else if (sunnyIcon.className === "active") {
      sunnyIcon.classList.toggle("active");
    }
  });
}
