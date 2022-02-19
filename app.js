/* The user choses a city to show information about by using a dropdown
list and then clicking the search button.

This calls the initial function that reads the city input, and calls the 
other functions with the input as parameter.

The other functions gets data from their respective sources, and 
presents it in their corresponding divs on the homepage
*/

// Variables for handling the map
var map, mapMarker;

// Function that sets up a weather widget using data from openweathermap.org
function getWeather(weatherId) {
  "use strict";
  // Delete weather data from widget
  $("#openweathermap-widget-15").html("");

  // Delete previous script from document's head to avoid multiple copies
  $('script[src="//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js"]').remove();

  // Widget code from openweathermap.org to get weather data with weatherId
  window.myWidgetParam = [
    {
      id: 15,
      cityid: weatherId,
      appid: "fc2cef4d05e5acca0565daf50456a1af",
      units: "metric", 
      containerid: "openweathermap-widget-15",
    },
  ];

  (function () {
    var script = document.createElement("script");
    script.async = true;
    script.src =
      "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(script, s);
  })();
}
// Load initial weather widget with Malmö, Sweden weather data
getWeather("2692969");

// Set up initial map with Malmö, Sweden coordinates
function getMap() {
  "use strict";
  map = L.map("map").setView([55.583, 13.0333], 11);
  mapMarker = L.marker([55.583, 13.0333]).addTo(map);

  // Code from leafletjs.com to get baselayer from openstreetmap.org 
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoiZ3JlZW55NzMiLCJhIjoiY2szNXFhY3B4MWVoeTNobzJ0cjBrenl1biJ9.82vZeA5kvvzOlk2lFXlXlw",
    }
  ).addTo(map);
}
getMap();

// Update map with new coordinates
function updateMap(coordinates) {
  "use strict";
  map.setView(coordinates, 10);
  if (mapMarker) {
    map.removeLayer(mapMarker);
  }
  mapMarker = L.marker(coordinates).addTo(map);
}

// Function that reads input, then reads JSON data from a local file and uses that data
// to call other functions that collect weather and map data
function getInfo() {
  "use strict";
  var city = $("#city").val();
  $("#info").removeAttr("style");

  $.getJSON("info.json", function (data) {
    var cityData = data[city];
    getWeather(cityData.weatherId);
    updateMap(cityData.mapCoordinates);
    $("#info").text(cityData.infoText);
  });
}

// Add event listener to search button
$("#search-button").click(getInfo);
