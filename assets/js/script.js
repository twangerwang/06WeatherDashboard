const apiKey = 'b81e5e1a2d1463b4aa3c387115ee5935';  // Openweather One API, UV Index is not available
const weatherbitApiKey = 'e70bae9c16914a59b12bb0c6b597271d'; // Weather Bit API for getting UV Index
var searchForm = document.querySelector("#form-group");
var cityInput = document.querySelector("#city");
var button = document.querySelector(".btn");
var cityNameEl = document.querySelector(".cityName");
var tempEl = document.querySelector(".temp");
var windEl = document.querySelector(".wind");
var humidityEl = document.querySelector(".humidity");
var uvIndexEl = document.querySelector(".uvIndex");
var weatherIconEl = document.querySelector(".weatherIcon");
var citiesEl = document.querySelector("#cities");
var mainContainerEl = document.querySelector(".mainContainer");
var historyContainer = document.querySelector("#history");
var fiveDayEl = document.querySelector("#fivedayforecast");
let allCities = [];

// calls Openweather One API for current and 5 day forecast
const getApiData=(cityInput)=>{
    const urlcurrent='https://api.openweathermap.org/data/2.5/weather?q=' + cityInput + '&appid=' + apiKey + '&units=imperial'
    const urlforecast='https://api.openweathermap.org/data/2.5/forecast?q=' + cityInput + '&appid=' + apiKey + '&units=imperial'

    // API call for current weather
    fetch (urlcurrent)
        .then(function (response) {
        response.json()
        .then(function(data){
             weatherDisplay(data, cityInput);
             storage(data.name)
        })
    })
    // API call for 5 day forecast
    fetch (urlforecast)
        .then(function (response) {
        response.json()
        .then(function(data){
             forecastDisplay(data, cityInput);
        })
    })   
  }

// extracts current weather data and displays it
function weatherDisplay (weather, cityInput) {
    var time=(weather["dt"])*1000;
    var date=new Date(time).toLocaleDateString('en-US');
    var iconCode = weather["weather"]["0"]["icon"];
    var desc = weather["weather"]["0"]["description"];             
    var iconURL = "https://openweathermap.org/img/wn/"+iconCode+"@2x.png";
    var cityNameElValue = weather["name"]+" "+date;
    var tempElValue = "Temperature: "+weather["main"]["temp"]+" °F";
    var windElValue = "Wind: "+weather["wind"]["speed"]+" mph";
    var humidityElValue = "Humidity: "+weather["main"]["humidity"]+" %";

    cityNameEl.innerHTML = cityNameElValue;
    tempEl.innerHTML = tempElValue;
    windEl.innerHTML = windElValue;
    humidityEl.innerHTML = humidityElValue;
    weatherIconEl.innerHTML = `<img src=`+iconURL+`>`+ " "+desc;
           
    var lat = weather["coord"]["lat"];
    var lon = weather["coord"]["lon"];
    const urlUvi = 'https://api.weatherbit.io/v2.0/current?lat='+lat+'&lon='+lon+'&key='+weatherbitApiKey;

    // calls Weather Bit for UV Index
    fetch (urlUvi)
        .then(function (response) {
        response.json()
        .then(function(data){
            uviDisplay(data);
        })      
    } )   
}

// extracts UV data and displays it
function uviDisplay (uvi){
    var uv=(uvi["data"]["0"]["uv"]).toFixed(2);
    var uvIndexElValue = "UV Index: "+uv;
    uvIndexEl.innerHTML = uvIndexElValue;
        if (uv<=2) {
            uvIndexEl.classList.add("uvtwo");
        }else if (2<uv && uv<=5) {
            uvIndexEl.classList.add("uvfive");
        }else if (5<uv && uv<8) {
            uvIndexEl.classList.add("uveight");
        }else if (8<=uv && uv<=10) {
            uvIndexEl.classList.add("uvten");
        }else {
            uvIndexEl.classList.add("uvmax");
        }  
    }  

// creates the cards for the 5 day forecasts   
function forecastDisplay (forecast, cityInput){
    fiveDayEl.textContent="";
    var dateEntry = forecast["list"];
    for (i=7; i<40; i+=8){
    
        // select the next day
        var dailyForecast = dateEntry[i];
        var fiveDayForecastEl = document.createElement("div");
        fiveDayForecastEl.classList = "card bg-primary text-light m-2";

        // convert date from UNIX time, create, and append entry
        var forecastDate = document.createElement("h4");
        forecastDate.textContent = new Date((dateEntry[i].dt)*1000).toLocaleDateString('en-US');
        forecastDate.classList = "card-header text-center";
        fiveDayForecastEl.appendChild(forecastDate);

        // set icon, create, and append entry
        var forecastIcon = document.createElement("img");
        var forecastIconCode = dailyForecast["weather"]["0"]["icon"];
        forecastIcon.classList = "card-body text-center";
        forecastIcon.setAttribute("src", "https://openweathermap.org/img/wn/"+forecastIconCode+"@2x.png");
        fiveDayForecastEl.appendChild(forecastIcon);

        // set description, create, and append entry
        var forecastDescription = document.createElement("p");
        forecastDescription.textContent = dailyForecast["weather"]["0"]["description"];
        forecastDescription.classList = "card-body text-center";
        fiveDayForecastEl.appendChild(forecastDescription);

        // set temperature, create, and append entry
        var forecastTemp = document.createElement("span");
        forecastTemp.classList = "card-body text-center";
        forecastTemp.textContent = "Temperature: "+dailyForecast["main"]["temp"]+" °F";
        fiveDayForecastEl.appendChild(forecastTemp);

        // set wind, create, and append entry
        var forecastWind = document.createElement("span");
        forecastWind.classList = "card-body text-center";
        forecastWind.textContent = "Wind: "+dailyForecast["wind"]["speed"]+" mph";
        fiveDayForecastEl.appendChild(forecastWind);

        // set humidity, create, and append entry
        var forecastHumidity = document.createElement("span");
        forecastHumidity.classList = "card-body text-center";
        forecastHumidity.textContent = "Humidity: "+dailyForecast["main"]["humidity"]+" %";
        fiveDayForecastEl.appendChild(forecastHumidity);

        // append all cards to HTML
        fiveDayEl.appendChild(fiveDayForecastEl);
    }
}

// commits cities entered in local storage to be recalled using buttons created
var storage=(city)=>{
    if (!allCities.includes(city)){
        allCities.push(city)
        localStorage.setItem("history",JSON.stringify(allCities))
        var btn=document.createElement("button")
        btn.setAttribute("class", "button")
        btn.setAttribute("value", city)
        btn.textContent=city
        historyContainer.append(btn)
    }
    allCities=JSON.parse(localStorage.getItem("history"))|| []
}

// sets off API call for the current weather for the city entered 
searchForm.addEventListener("submit", ()=> {
    event.preventDefault()
    mainContainerEl.classList.replace("hide", "show");
    var cityInput = document.querySelector("#city").value.trim();
    getApiData(cityInput);
    document.getElementById("city").value="";
    uvIndexEl.classList.remove("uvtwo","uvfive","uveight","uvten","uvmax");
})

// sets off API call from button created by previous entry
historyContainer.addEventListener("click", (event)=>{
    event.preventDefault()
    var cityClick =this.event.target.value
    uvIndexEl.classList.remove("uvtwo","uvfive","uveight","uvten","uvmax");
    getApiData(cityClick)
})



