import { citySelection } from "./setWeatherDetails.js";
import { cities } from "./utility.js";

//Functionality to add autocomplete dropdown for top section, error handling for unknown city names, weather details based on city input selection
citySelection(document.querySelector(".city-input > input"), cities);
