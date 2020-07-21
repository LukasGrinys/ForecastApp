app.factory('weatherService', function(cityData, $http) {
    return weatherService = {
        data: {
            units: 'metric'
        },
        requestForCurrentWeatherData : function() {
            let cityId = cityData.cityId !== null ? cityData.cityId : false;
            if (!cityId) return;
            let apiKey = config.API_KEY;
            let units = weatherService.data.units;
            return $http.get(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=${units}`);
        },
        requestForFiveDayForecastData : function() {
            let cityId = cityData.cityId !== null ? cityData.cityId : false;
            if (!cityId) return;
            let apiKey = config.API_KEY;
            let units = weatherService.data.units;
            return $http.get(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}&units=${units}`)
        },
        changeUnits : function(units) {
            if (weatherService.data.units === units || config.AVAILABLE_UNITS.indexOf(units) === -1) return;
            weatherService.data.units = units;
            localStorage.setItem('forecast-units', units);
        }
        
    };
});