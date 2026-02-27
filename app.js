function WeatherApp(apiKey) {
  this.apiKey = apiKey;
  this.baseUrl = "https://api.openweathermap.org/data/2.5";

  this.cityInput = document.getElementById("city-input");
  this.searchButton = document.getElementById("search-btn");
  this.currentWeatherContainer = document.getElementById("current-weather");
  this.forecastContainer = document.getElementById("forecast");

  this.init();
}

/* ---------------- INIT ---------------- */

WeatherApp.prototype.init = function() {
  this.searchButton.addEventListener(
    "click",
    this.handleSearch.bind(this)
  );
};

/* ---------------- HANDLE SEARCH ---------------- */

WeatherApp.prototype.handleSearch = function() {
  const city = this.cityInput.value.trim();

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  this.fetchWeather(city);
};

/* ---------------- FETCH WEATHER ---------------- */

WeatherApp.prototype.fetchWeather = function(city) {
  const currentUrl = `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
  const forecastUrl = `${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

  Promise.all([
    fetch(currentUrl),
    fetch(forecastUrl)
  ])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(data => {
      const currentData = data[0];
      const forecastData = data[1];

      this.displayCurrentWeather(currentData);
      this.displayForecast(forecastData);
    })
    .catch(error => {
      console.error("Error fetching weather:", error);
      alert("Failed to fetch weather data.");
    });
};

/* ---------------- DISPLAY CURRENT WEATHER ---------------- */

WeatherApp.prototype.displayCurrentWeather = function(data) {
  this.currentWeatherContainer.innerHTML = `
    <h2>${data.name}</h2>
    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
    <p><strong>Condition:</strong> ${data.weather[0].description}</p>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
  `;
};

/* ---------------- DISPLAY 5-DAY FORECAST ---------------- */

WeatherApp.prototype.displayForecast = function(data) {
  this.forecastContainer.innerHTML = "";

  const dailyData = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.slice(0, 5).forEach(day => {
    const card = document.createElement("div");
    card.className = "forecast-card";

    card.innerHTML = `
      <h3>${new Date(day.dt_txt).toDateString()}</h3>
      <p>${day.main.temp}°C</p>
      <p>${day.weather[0].description}</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
    `;

    this.forecastContainer.appendChild(card);
  });
};

/* ---------------- CREATE APP INSTANCE ---------------- */

const app = new WeatherApp("c752a5d58afc5e6584686abc1661cac0");