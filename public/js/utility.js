export const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export const cities = [
  "Anadyr",
  "Auckland",
  "BangKok",
  "BrokenHill",
  "Dublin",
  "Jamaica",
  "Juba",
  "Karachi",
  "Kolkata",
  "London",
  "LosAngeles",
  "Maseru",
  "Moscow",
  "NewYork",
  "Nome",
  "Perth",
  "Seoul",
  "Troll",
  "Vienna",
  "Vostok",
  "Winnipeg",
  "Yangon",
];

export const clock = [
  "12 AM",
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
  "11 PM",
];

//Interval for setinterval functions
export const oneSecondInterval = 1000;
export const oneHourInterval = 3600000;
export const oneMinuteInterval = 60000;

//Function to sort the data for middle container
export function sortData(weatherArray, condition) {
  // Extract temperature values from a and b objects and convert to numbers
  if (condition === "Sunny") {
    weatherArray.sort(function (a, b) {
      // Extract temperature values from a and b objects and convert to numbers
      let tempA = parseFloat(a.temperature.split("°C")[0]);
      let tempB = parseFloat(b.temperature.split("°C")[0]);
      // Compare temperature values and return the appropriate comparison result
      if (tempA > tempB) {
        return -1;
      } else if (tempA < tempB) {
        return 1;
      } else {
        return 0;
      }
    });
    return weatherArray;
  } else if (condition === "Rainy" || condition === "Snowy") {
    weatherArray.sort(function (a, b) {
      // Extract temperature values from a and b objects and convert to numbers
      let valueA, valueB;
      if (condition === "Rainy") {
        valueA = parseFloat(a.humidity.split("%")[0]);
        valueB = parseFloat(b.humidity.split("%")[0]);
      } else {
        valueA = parseFloat(a.precipitation.split("%")[0]);
        valueB = parseFloat(b.precipitation.split("%")[0]);
      }
      // Compare temperature values and return the appropriate comparison result
      if (valueA > valueB) {
        return -1;
      } else if (valueA < valueB) {
        return 1;
      } else {
        return 0;
      }
    });
    return weatherArray;
  }
}

//Function to clear the timers
export function clearTimers(...timerId) {
  for (let i = 0; i < timerId.length; i++) {
    clearInterval(timerId[i]);
  }
}
