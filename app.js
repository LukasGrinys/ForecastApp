window.addEventListener('load', e => {
    registerSW(); 
});

async function registerSW() { 
    if ('serviceWorker' in navigator) { 
      try {
        await navigator.serviceWorker.register('./serviceWorker.js'); 
      } catch (e) {
        alert('ServiceWorker registration failed. Sorry about that.'); 
      }
    } else {
      document.querySelector('.alert').removeAttribute('hidden'); 
    }
}

const app = angular.module("forecastApp", []);

app.controller("appController", function($scope, cityData, weatherService, storageHandler) {
    $scope.displayedWeatherData;
    $scope.fiveDayData = [];
    $scope.forecastLoading = false;
    $scope.showingCurrent = true;
   
    $scope.serviceError = false;
    $scope.serviceErrorMessage = '';

    let ctrl = this;

    $scope.getWeatherData = () => {
        let cityId = cityData.cityId !== null ? cityData.cityId : false;
        if (!cityId || !cityData.cityAssigned) return;
        $scope.forecastLoading = true;
        $scope.forecastHourIndex = 0;
        $scope.displayedWeatherData = undefined;
        $scope.fiveDayData = [];
        $scope.thumbnailData = [];
        weatherService.requestForCurrentWeatherData().then( (response) => {
            if (!cityData.cityAssigned) return;
            if (response.status === 200) {
                const data = response.data;
                const timeObj = helpers.convertMilisecondsToDate(data.dt);
                const dataObj = {
                    temperature: data.main.temp,
                    icon: data.weather[0].icon,
                    id: data.weather[0].id,
                    description: helpers.capitalize(data.weather[0].description),
                    wind: data.wind.speed.toFixed(1),
                    date: "Current",
                    time: timeObj.time,
                    weekDay: timeObj.weekDay
                }
                $scope.forecastLoading = false;
                $scope.displayedWeatherData = dataObj;
                $scope.showingCurrent = true;
                weatherService.requestForFiveDayForecastData()
                .then( (response) => {
                    if (response.status === 200) {
                        const data = response.data;
                        if (!cityData.cityAssigned) { 
                            $scope.forecastHourIndex = 0;
                            $scope.displayedWeatherData = undefined;
                            return;
                        }
                        $scope.fiveDayData = data.list;
                    } else {
                        $scope.displayedWeatherData = undefined;
                        let message = "Could not access to weather service. Try again later.";
                        ctrl.showError(message);
                    }
                }).catch( (err) => {
                    $scope.displayedWeatherData = undefined;
                    let message = "Could not access to weather service. Try again later. ";
                    message += "Error: " + err;
                    ctrl.showError(message);
                })
            } else {
                let message = "Could not access to weather service. Try again later.";
                ctrl.showError(message);
            }
        }).catch( (err) => {
            let message = "Could not access to weather service. Try again later. ";
            message += "Error: " + err;
            ctrl.showError(message);
        })
    }

    $scope.updateDisplayedData = (dataObj) => {
        $scope.showingCurrent = false;
        $scope.displayedWeatherData = dataObj;
    }

    $scope.showCurrent = () => {
        $scope.forecastLoading = true;
        $scope.getWeatherData();
    }

    this.cleanFiveDayData = () => {
        $scope.fiveDayData = [];
    }

    this.showError = (error) => {
        $scope.serviceError = true;
        $scope.serviceErrorMessage = error;
        $scope.forecastLoading = false;
        $scope.$apply();
    }

    this.$onInit = function() {
        storageHandler.loadStoredData();
        storageHandler.loadStoredUnits();
        $scope.getWeatherData();
    };    
});