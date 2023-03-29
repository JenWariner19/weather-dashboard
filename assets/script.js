var apiKey = "59beaebe4775f6a237d0e02dcd8b1a90";
var cityInput = document.getElementById("search-input");
var searchBtn = document.getElementById("search-Btn");
var cityRequest = document.getElementById("city-name");
var currentTemp = document.getElementById("temperature");
var currentHum = document.getElementById("humidity");
var currentWS = document.getElementById("wind-speed");
var currentIcon = document.getElementById("current-icon");


function currentWeather() {
    var cityValue = cityInput.value;
    var cityState = cityValue.split(",");
    var city = cityState[0];
    var state = cityState[1];
    var country = "US";
    var requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + state + "," + country + "&appid=" + apiKey;

    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var lat = data[0].lat
        var lon = data[0].lon
        var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";
        fetch(currentWeatherUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            var cityName = data.name;
            var temp = data.main.temp;
            var wind = data.wind.speed;
            var humidity = data.main.humidity;
            var weatherIcon = data.weather[0].icon;

            cityRequest.textContent = cityName;
            currentIcon.textContent = weatherIcon;
            currentTemp.textContent = "Temp: " + temp;
            currentWS.textContent = "Wind: " + wind;
            currentHum.textContent = "Humidity: " + humidity;
        })
    })
}

searchBtn.addEventListener("click", currentWeather);
