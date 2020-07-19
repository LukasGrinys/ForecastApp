const app = angular.module("forecastApp", []);

const config = {
    apiKey : "2bf6f157641b1e005b65dbcebb02a719"
}


app.controller("appController", function($scope, $sce) {
    $scope.userConfig = {
        units : 'metric'
    }

    $scope.cityData;
    $scope.cityDataLoading = true;
    $scope.cityInput = "";
    $scope.cityList = [];
    $scope.autoLocation = '';
    
    $scope.manualInputOpen = false;
    $scope.autocompleteOpen = false;
    $scope.autoFindOpen = false;
    $scope.inputErrorMessage = '';
    
    $scope.cityAssigned = false;
    $scope.cityName = null;
    $scope.cityId = null;

    $scope.displayedWeatherData;
    $scope.fiveDayData = [];
    $scope.forecastHourIndex = 0;
    $scope.thumbnailData = [];
    $scope.forecastLoading = false;
    $scope.showingCurrent = true;

    $scope.serviceError = false;
    $scope.serviceErrorMessage = '';

    $scope.requestForCityData = () => {
        fetch('city.list.json')
        .then( (response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 404) {
                $scope.inputErrorMessage = 'Could not load city data. Try reloading the page.';
                $scope.cityDataLoading = false;
                $scope.$apply();
                return;
            }
        }).then( (data) => {
            if (!data) return;
            $scope.cityDataLoading = false;
            $scope.cityData = data;
            $scope.$apply();
        }).catch( (err) => {
            console.log(err);
        })
    }

    $scope.openManualInput = () => {
        $scope.manualInputOpen = true;
        $scope.autoFindOpen = false;
        $scope.autoLocation = '';
    }

    $scope.openAutoFind = () => {
        $scope.manualInputOpen = false;
        $scope.autoFindOpen = true;
    }

    $scope.inputHandler = () => {
        if ($scope.inputErrorMessage !== "") {
            $scope.inputErrorMessage = '';
        }
        if ($scope.cityInput.length > 3 && $scope.cityData) {
            $scope.autocompleteOpen = true;
            let input = $scope.cityInput.trim().toLowerCase();
            let searchResults = [];
            let dataLength = $scope.cityData.length;
            for (let i = 0; i < dataLength; i++) {
                let cityName = $scope.cityData[i].name;
                if (cityName.toLowerCase().includes(input)) {
                    searchResults.push(cityName);
                }
            };
            $scope.cityList = searchResults;
            if (searchResults.length === 0) {
                $scope.autocompleteOpen = false;
            }

        } else {
            $scope.autocompleteOpen = false;
        }
    }

    $scope.pickCity = (city) => {
        $scope.autocompleteOpen = false;
        $scope.cityInput = city;
    }

    $scope.selectCity = () => {
        if ($scope.cityInput.length !== 0) {
            const cityData = $scope.cityData;
            const cityInput = $scope.cityInput;
            for (let i = 0; i < cityData.length; i++) {
                if (cityData[i].name === cityInput) {
                    $scope.assignCity(cityData[i].name, cityData[i].id);
                    $scope.cityInput = "";
                    return;
                }
            }
            $scope.inputErrorMessage = "Sorry, we couldn't find city you are looking for";
            $scope.autocompleteOpen = false;
        }
    }

    $scope.autoFind = () => {
        let latitude, longitude;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( (position) => {
                latitude = position.coords.latitude; 
                longitude = position.coords.longitude; 
                let autolocation = helpers.searchForAClosest( $scope.cityData, latitude, longitude);
                $scope.autoLocation = autolocation;
                $scope.$apply();
            });
        } else {
           $scope.inputErrorMessage = "Geolocation is not supported by this browser.";
           $scope.manualInputOpen = true;
           $scope.autoFindOpen = false;
        }
    }

    $scope.selectAutoLocation = () => {
        const cityData = $scope.cityData;
        const city = $scope.autoLocation;
        for (let i = 0; i < cityData.length; i++) {
            if (cityData[i].name === city) {
                $scope.assignCity(cityData[i].name, cityData[i].id);
                $scope.autoLocation = '';
                return;
            }
        }
    }

    $scope.assignCity = (cityName, cityId) => {
        $scope.cityName = cityName;
        $scope.cityId = cityId;
        $scope.manualInputOpen = false;
        $scope.autoFindOpen = false;
        $scope.cityAssigned = true;
        storeData(cityName, cityId);
        requestForWeatherData();
    }

    requestForWeatherData = () => {
        if (!$scope.cityAssigned) return;  
        let cityId = $scope.cityId !== null ? $scope.cityId : false;
        if (!cityId) return;
        $scope.forecastLoading = true;
        $scope.forecastHourIndex = 0;
        $scope.displayedWeatherData = undefined;
        $scope.fiveDayData = [];
        $scope.thumbnailData = [];
        // Current weather data
        fetch(`http://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${config.apiKey}&units=${$scope.userConfig.units}`)
        .then( (response) => {
            return response.json();
        }).then( (data) => {
            const dataObj = {
                temperature: data.main.temp,
                icon: data.weather[0].icon,
                id: data.weather[0].id,
                description: helpers.capitalize(data.weather[0].description),
                wind: data.wind.speed.toFixed(1),
                date: "Current",
                time: ""
            }
            $scope.forecastLoading = false;
            $scope.displayedWeatherData = dataObj;
            $scope.showingCurrent = true;
            $scope.forecastLoading = false;
            $scope.$apply();
            // 5 day forecast
            fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${config.apiKey}&units=${$scope.userConfig.units}`)
            .then( (response) => {
                return response.json();
            }).then( (data) => {
                $scope.fiveDayData = data.list;
                $scope.thumbnailData = helpers.formFiveDayThumbnailData($scope.fiveDayData);
                $scope.$apply();
                
            }).catch( (err) => {
                let message = "Could not access to weather service. Try again later. ";
                message += "Error: " + err;
                $scope.showError(message);
            })
        }).catch( (err) => {
            let message = "Could not access to weather service. Try again later. ";
            message += "Error: " + err;
            $scope.showError(message);
        })
    }

    $scope.changeLocation = () => {
        $scope.cityName = null;
        $scope.cityId = null;
        $scope.cityAssigned = false;
        $scope.manualInputOpen = false;
        $scope.autoFindOpen = false;
        $scope.displayedWeatherData = undefined;
        $scope.fiveDatyData = [];
        $scope.forecastHourIndex = 0;
        $scope.thumbnailData = [];
        storeData(null, null);
    }

    storeData = (cityName, cityId) => {
        if (cityName === null || cityId === null) {
            localStorage.removeItem('forecast-city-name');
            localStorage.removeItem('forecast-city-id');

        } else {
            localStorage.setItem('forecast-city-name', cityName);
            localStorage.setItem('forecast-city-id', cityId);
        }
    }

    loadStoredData = () => {
        let cityName = localStorage.getItem('forecast-city-name');
        let cityId = localStorage.getItem('forecast-city-id');
        if (cityName !== null && cityId !== null) {
            $scope.cityName = cityName;
            $scope.cityId = cityId;
            $scope.cityAssigned = true;
        }
    }

    loadStoredUnits = () => {
        let units = localStorage.getItem('forecast-units');
        if (units === null) {
            localStorage.setItem('forecast-units', 'metric');
        } else {
            $scope.userConfig.units = localStorage.getItem('forecast-units');
        };
    }

    $scope.forecastRangeHandler = () => {
        const hour = $scope.forecastHourIndex;
        const data = $scope.fiveDayData[hour];
        const dataObj = {
            temperature: data.main.temp,
            icon: data.weather[0].icon,
            id: data.weather[0].id,
            description: helpers.capitalize(data.weather[0].description),
            wind: data.wind.speed.toFixed(1),
            date: helpers.returnDateString(data.dt_txt.slice(5,10)),
            time: data.dt_txt.slice(11,16)
        }
        $scope.showingCurrent = false;
        $scope.displayedWeatherData = dataObj;
    }

    $scope.returnDayBoxIcon = (icon, temperature) => {
        if (icon === 'dataobj.icon') return null;
        let unitString = $scope.userConfig.units === 'metric' ? '°C' : '°F';
        return $sce.trustAsHtml(`
        <img class="day-box-icon" src="/public/icons/${icon}.png">
        <div class="day-box-temp">${temperature} <span style="font-weight:300;font-size:0.8rem">${unitString}</span></div>
        `);
    } 

    $scope.returnMainBoxContent = (icon, temperature) => {
        if (icon === undefined || temperature === undefined || $scope.forecastLoading) return null;
        let unitString = $scope.userConfig.units === 'metric' ? '°C' : '°F';
        return $sce.trustAsHtml(`
        <div class="main-box-temperature flex-center">${temperature.toFixed()} 
        <span style="font-size:2.5rem">${unitString}</span> </div>
        <img class="main-box-icon" src="/public/icons/${icon}.png">
        `);
    } 

    $scope.setForecastHourIndex = (index) => {
        $scope.forecastHourIndex = index;
        $scope.forecastRangeHandler();
    }

    $scope.showCurrent = () => {
        $scope.forecastLoading = true;
        requestForWeatherData();
        $scope.forecastHourIndex = 0;
    }

    $scope.changeUnits = (units) => {
        if ($scope.userConfig.units === units) return;
        $scope.userConfig.units = units;
        localStorage.setItem('forecast-units', units);
        requestForWeatherData();

    }

    $scope.showError = (error) => {
        $scope.serviceError = true;
        $scope.serviceErrorMessage = error;
        $scope.forecastLoading = false;
        $scope.$apply();
    }

    $scope.init = function() {
        loadStoredData();
        loadStoredUnits();
        $scope.requestForCityData();
        requestForWeatherData();
    };

    
});


class Helpers {
    countEuclidian(x, y) {
        return Math.sqrt(x * x + y * y);
    }
    searchForAClosest(data, lat, lon) {
        let minDistance;
        let closestCity = "";
        for (let i = 0; i < data.length; i++) {
            let absLatitude = Math.abs(data[i].coord.lat - lat);
            let absLongitude = Math.abs(data[i].coord.lon - lon);
            let distance = this.countEuclidian(absLatitude, absLongitude);
            if (minDistance === undefined || minDistance >= distance) {
                minDistance = distance;
                closestCity = data[i].name;
            }
        }
        return closestCity;
    }

    formFiveDayThumbnailData(array) {
        let firstDate = array[0].dt_txt.slice(0,10);
        let firstTime = array[0].dt_txt.slice(11);
        let dateMap = [];
        let results = [];
        for (let i = 0; i < array.length; i++) {
            if (results.length === 5) {
                break;
            }
            if (i === 0) {
                dateMap.push(array[i].dt_txt.slice(0,10));
                let dataObj = {
                    date: array[i].dt_txt.slice(5,10),
                    time: array[i].dt_txt.slice(11,16),
                    id: i,
                    temperature: array[i].main.temp.toFixed(),
                    icon: array[i].weather[0].icon
                };
                results.push(dataObj);
            } else if (array[i].dt_txt.slice(11,19) === "12:00:00" && dateMap.indexOf(array[i].dt_txt.slice(0,10)) === -1) {
                dateMap.push(array[i].dt_txt.slice(0,10));
                let dataObj = {
                    date: array[i].dt_txt.slice(5,10),
                    time: array[i].dt_txt.slice(11,16),
                    id: i,
                    temperature: array[i].main.temp.toFixed(),
                    icon: array[i].weather[0].icon
                };
                results.push(dataObj);
            } else if (i === array.length - 1 && results.length === 4) {
                dateMap.push(array[i].dt_txt.slice(0,10));
                let dataObj = {
                    date: array[i].dt_txt.slice(5,10),
                    time: array[i].dt_txt.slice(11,16),
                    id: i,
                    temperature: array[i].main.temp.toFixed(),
                    icon: array[i].weather[0].icon
                };
                results.push(dataObj);
            }
        }
        return results
    }

    returnDateString(date) {
        let month = date.slice(0,2);
        let day = date.slice(3,5);
    
        const map = {
            '01' : 'January',
            '02' : 'February',
            '03' : 'March',
            '04' : 'April',
            '05' : 'May',
            '06' : 'June',
            '07' : 'July',
            '08' : 'August',
            '09' : 'September',
            '10' : 'October',
            '11' : 'November',
            '12' : 'December'
        };
        let dayString = '';
        if (day === '01') {
            dayString = day + 'st'
        } else if (day === '02') {
            dayString = day + 'nd'
        } else if (day === '03') {
            dayString = day + 'rd'
        } else {
            dayString = day + 'th'
        }
        return `${map[month]} ${dayString}`
    }

    capitalize(string) {
        return string.slice(0,1).toUpperCase() + string.slice(1);
    }
}

var helpers = new Helpers();
