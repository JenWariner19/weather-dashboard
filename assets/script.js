//Set variables for HTML and API Key

var apiKey = "59beaebe4775f6a237d0e02dcd8b1a90";
var cityInput = document.getElementById("search-input");
var searchBtn = document.getElementById("search-Btn");
var cityRequest = document.getElementById("city-name");
var currentTemp = document.getElementById("temperature");
var currentHum = document.getElementById("humidity");
var currentWS = document.getElementById("wind-speed");
var currentIcon = document.getElementById("current-icon");
var weatherHistory = JSON.parse(localStorage.getItem("cities"))||[];
var currentDay = dayjs();

//Created function to display the stored city searches and display weather when a stored city is clicked
function displayHistory() {
    var weatherHistory = JSON.parse(localStorage.getItem("cities"))||[];
    document.querySelector("#saved").innerHTML = "";
    for(var i=0; i < weatherHistory.length; i++) {
        var button = document.createElement("button")
        button.className = "col m-2 badge bg-primary text-white rounded";
        button.innerText = weatherHistory[i].city + "," + weatherHistory[i].state;
        button.addEventListener("click", function(event) {
            var cityState = event.target.innerText.split(",");  
            getWeather(cityState[0], cityState[1])
        })
        document.querySelector("#saved").appendChild(button)
    }
}
displayHistory()

//Created function to get current weather and a 5-day forecast and add them to the page
function getWeather(prevCity, prevState) {
    var cityValue = cityInput.value;
    var cityState = cityValue.split(",");
    var city = prevCity || cityState[0];
    var state = prevState || cityState[1];
    var country = "US";
    var requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + state + "," + country + "&appid=" + apiKey;
    if(!weatherHistory.map(obj => obj.city).includes(city) && !weatherHistory.map(obj => obj.state).includes(state))  {
        weatherHistory.push({city,state})}
    localStorage.setItem("cities", JSON.stringify(weatherHistory))
    displayHistory()
    
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var lat = data[0].lat
        var lon = data[0].lon
        var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";
        var futureWeather = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";

        fetch(currentWeatherUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            cityRequest.textContent = data.name + " - " + currentDay.format(" MMM DD, YYYY");
            currentTemp.textContent = "Temp: " + data.main.temp + " F";
            currentWS.textContent = "Wind: " + data.wind.speed + " mph";
            currentHum.textContent = "Humidity: " + data.main.humidity + "%";
            currentIcon.src = "https://openweathermap.org/img/wn/"+data.weather[0].icon+".png";

        })
        fetch(futureWeather)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            document.querySelector("#future-container").innerHTML = "";
            for(var i = 7; i < data.list.length; i+=8) {
                var div = document.createElement("div")
                div.className = "col-2 m-2 badge bg-primary text-white rounded border border-dark";
                var date = document.createElement("p");
                date.innerText = dayjs.unix(data.list[i].dt).format(" MMM DD");
                div.appendChild(date);
                var image = document.createElement("img");
                image.src = "https://openweathermap.org/img/wn/"+data.list[i].weather[0].icon+".png";
                div.appendChild(image);
                var temp = document.createElement("p");
                temp.innerText = "Temp: " + data.list[i].main.temp + " F";
                div.appendChild(temp);
                var wind = document.createElement("p");
                wind.innerText = "Wind: " + data.list[i].wind.speed + " mph";
                div.appendChild(wind);
                var hum = document.createElement("p");
                hum.innerText = "Humidity: " + data.list[i].main.humidity + "%";
                div.appendChild(hum);

                document.querySelector("#future-container").appendChild(div);
            }
    })
    })
}


searchBtn.addEventListener("click", function(){
    getWeather()
});
