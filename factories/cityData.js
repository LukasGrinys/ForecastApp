app.factory('cityData', () => {
    let cityData = {
        cityName : null,
        cityId : null,
        cityAssigned : false
    }
    
    cityData.setCityData = (name, id) => {
        if (name === null || id === null) {
            cityName = null;
            cityId = null;
            cityAssigned = false;
            localStorage.removeItem('forecast-city-name');
            localStorage.removeItem('forecast-city-id');
        } else {
            cityData.cityName = name;
            cityData.cityId = id;
            localStorage.setItem('forecast-city-name', name);
            localStorage.setItem('forecast-city-id', id);
            cityData.cityAssigned = true;
        }
    }
    return cityData
})