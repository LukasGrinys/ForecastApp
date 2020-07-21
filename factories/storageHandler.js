app.factory('storageHandler', (weatherService, cityData) => {
    return storageHandler = {
        loadStoredUnits : function() {
            let units = localStorage.getItem('forecast-units');
            if (units === null) {
                localStorage.setItem('forecast-units', 'metric');
            } else {
                weatherService.data.units = localStorage.getItem('forecast-units');
            };
        },
        loadStoredData : function() {
            let cityName = localStorage.getItem('forecast-city-name');
            let cityId = localStorage.getItem('forecast-city-id');
            if (cityName !== null && cityId !== null) {
                cityData.cityName = cityName;
                cityData.cityId = cityId;
                cityData.cityAssigned = true;
            }
        }
    }
})