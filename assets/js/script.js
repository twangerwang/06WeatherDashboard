const apiKey = 'b81e5e1a2d1463b4aa3c387115ee5935';
const weatherbitApiKey = 'e70bae9c16914a59b12bb0c6b597271d';
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


const getApiData=(cityInput)=>{
    const urlcurrent='https://api.openweathermap.org/data/2.5/weather?q=' + cityInput + '&appid=' + apiKey + '&units=imperial'
    const urlforecast='https://api.openweathermap.org/data/2.5/forecast?q=' + cityInput + '&appid=' + apiKey + '&units=imperial'

    fetch (urlcurrent)
        .then(function (response) {
        response.json()
        .then(function(data){
             weatherDisplay(data, cityInput);
             storage(data.name)
        })
    })
    fetch (urlforecast)
        .then(function (response) {
        response.json()
        .then(function(data){
             forecastDisplay(data, cityInput);
        })
    })   
  }
        
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

    fetch (urlUvi)
        .then(function (response) {
        response.json()
        .then(function(data){
            uviDisplay(data);
        })      
    } )   
}

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
    
function forecastDisplay (forecast, cityInput){
    fiveDayEl.textContent="";
    var dateEntry = forecast["list"];
    for (i=7; i<40; i+=8){
    
        var dailyForecast = dateEntry[i];
        var fiveDayForecastEl = document.createElement("div");
        fiveDayForecastEl.classList = "card bg-primary text-light m-2";

        var forecastDate = document.createElement("h4");
        forecastDate.textContent = new Date((dateEntry[i].dt)*1000).toLocaleDateString('en-US');
        forecastDate.classList = "card-header text-center";
        fiveDayForecastEl.appendChild(forecastDate);

        var forecastIcon = document.createElement("img");
        var forecastIconCode = dailyForecast["weather"]["0"]["icon"];
        forecastIcon.classList = "card-body text-center";
        forecastIcon.setAttribute("src", "https://openweathermap.org/img/wn/"+forecastIconCode+"@2x.png");
        fiveDayForecastEl.appendChild(forecastIcon);

        var forecastTemp = document.createElement("span");
        forecastTemp.classList = "card-body text-center";
        forecastTemp.textContent = "Temperature: "+dailyForecast["main"]["temp"]+" °F";
        fiveDayForecastEl.appendChild(forecastTemp);

        var forecastWind = document.createElement("span");
        forecastWind.classList = "card-body text-center";
        forecastWind.textContent = "Wind: "+dailyForecast["wind"]["speed"]+" mph";
        fiveDayForecastEl.appendChild(forecastWind);

        var forecastHumidity = document.createElement("span");
        forecastHumidity.classList = "card-body text-center";
        forecastHumidity.textContent = "Humidity: "+dailyForecast["main"]["humidity"]+" %";
        fiveDayForecastEl.appendChild(forecastHumidity);

        fiveDayEl.appendChild(fiveDayForecastEl);
    }
}

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
        
searchForm.addEventListener("submit", ()=> {
    event.preventDefault()
    mainContainerEl.classList.replace("hide", "show");
    var cityInput = document.querySelector("#city").value.trim();
    getApiData(cityInput);
    document.getElementById("city").value="";
    uvIndexEl.classList.remove("uvtwo","uvfive","uveight","uvten","uvmax");
})

    historyContainer.addEventListener("click", (event)=>{
        event.preventDefault()
        var cityClick =this.event.target.value
        uvIndexEl.classList.remove("uvtwo","uvfive","uveight","uvten","uvmax");
        getApiData(cityClick)
    })



