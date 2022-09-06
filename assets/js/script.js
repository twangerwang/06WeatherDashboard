const apiKey = 'b81e5e1a2d1463b4aa3c387115ee5935';
var searchForm = document.querySelector("#form-group");
var cityInput = document.querySelector("#city");
var button = document.querySelector(".btn");
var cityNameEl = document.querySelector(".cityName");
var tempEl = document.querySelector(".temp");
var windEl = document.querySelector(".wind");
var humidityEl = document.querySelector(".humidity");
var uvIndexEl = document.querySelector(".uvIndex");

// function handleCitySubmit(event) {
//     event.preventDefault();

    
// }
// cityInput.addEventListener("submit", handleCitySubmit);
searchForm.addEventListener("submit", function() {
    event.preventDefault()
    
    var cityInput = document.querySelector("#city").value;
    console.log(cityInput);
    // if (!cityInput) {
    //     console.error("City not Found!!!");
    //     return;
    // }

    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityInput + '&appid=' + apiKey + '&units=imperial')
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
            console.log(data);
        })
        // .then(data => console.log(data))
    // .then(response => response.json())
        // .then(data => console.log(data))
        .then(data => {
            var cityNameElValue = data["name"];
            var tempElValue = "Temperature: " + data["main"]["temp"] + " °F";
            var windElValue = "Wind: " + data["wind"]["speed"] + " mph";
            var humidityElValue = "Humidity: " + data["main"]["humidity"] + " %";
            // var = uvIndexElValue = data[];
            cityNameEl.innerHTML = cityNameElValue;
            tempEl.innerHTML = tempElValue;
            windEl.innerHTML = windElValue;
            humidityEl.innerHTML = humidityElValue;
         })
         
    });  
    


console.log(apiKey);
console.log(cityInput);


