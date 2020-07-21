angular.module('forecastApp').component('inputBox', {
    templateUrl: 'components/input-box.component.html',
    bindings : {
        updateDisplayedData : "&",
        cleanFiveDayData : "&",
        getWeatherData : "&"
    },
    controller: function InputController($scope, $http, cityData) {
        this.currentCityList; // List of all the cities available
        this.cityDataLoading = true; // Sets to false when cities load
        this.cityInput = "";
        this.citySearchResults = [];
        this.autoLocation = '';
        this.manualInputOpen = false;
        this.autocompleteOpen = false;
        this.autoFindOpen = false;
        this.inputErrorMessage = '';
        this.cityAssigned = cityData.cityAssigned;
        this.cityName = cityData.cityName;

        this.requestForCityData = () => {
            $http.get('currentCitylistReduced.json')
            .then( (response) => {
                if (response.status === 200) {
                    const data = response.data;
                    if (!data) return;
                    this.cityDataLoading = false;
                    this.currentCityList = data;
                } else if (response.status === 404) {
                    this.inputErrorMessage = 'Could not load city data. Try reloading the page.';
                    this.cityDataLoading = false;
                    return;
                }
            }).catch( (err) => {
                console.log(err);
                this.inputErrorMessage = err;
                this.cityDataLoading = false;
            })
        }
        
        this.openManualInput = () => {
            this.manualInputOpen = true;
            this.autoFindOpen = false;
            this.autoLocation = '';
        }

        this.openAutoFind = () => {
            this.manualInputOpen = false;
            this.autoFindOpen = true;
        }

        this.$onInit = () => {
            this.requestForCityData();
        }

        this.inputHandler = () => {
            if (this.inputErrorMessage !== "") { this.inputErrorMessage = "";}
            if (this.cityInput.length > 3 && this.currentCityList) {
                this.autocompleteOpen = true;
                let input = this.cityInput.trim().toLowerCase();
                let searchResults = [];
                let dataLength = this.currentCityList.length;
                for (let i = 0; i < dataLength; i++) {
                    let cityName = this.currentCityList[i].name;
                    if (cityName.toLowerCase().includes(input)) {
                        searchResults.push(cityName);
                    }
                };
                this.citySearchResults = searchResults;
                if (searchResults.length === 0) {
                    this.autocompleteOpen = false;
                }
    
            } else {
                this.autocompleteOpen = false;
            }
        }

        this.pickCity = (city) => {
            this.autocompleteOpen = false;
            this.cityInput = city;
        }

        this.selectCity = () => {
            if (this.cityInput.length !== 0) {
                let cityList = this.currentCityList;
                let cityInput = this.cityInput;
                for (let i = 0; i < cityList.length; i++) {
                    if (cityList[i].name === cityInput) {
                        this.manualInputOpen = false;
                        this.autoFindOpen = false;
                        this.cityInput = "";
                        this.cityAssigned = true;
                        this.cityName = cityList[i].name;
                        cityData.setCityData(cityList[i].name, cityList[i].id);
                        this.getWeatherData();
                        this.showLocation = true;
                        return;
                    }
                }
                this.inputErrorMessage = "Sorry, we couldn't find the city you were looking for";
                this.autocompleteOpen = false;
            }
        }

        this.changeLocation = () => {
            cityData.setCityData(null, null)
            this.cityAssigned = false;
            this.manualInputOpen = false;
            this.autoFindOpen = false; 
            this.updateDisplayedData({dataObj : undefined, isCurrent : true});
            this.cleanFiveDayData();
        }

        this.autoFind = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition( (position) => {
                    let latitude = position.coords.latitude; 
                    let longitude = position.coords.longitude; 
                    let currentCityList = this.currentCityList;
                    let autolocation = helpers.searchForAClosest(currentCityList, latitude, longitude);
                    this.autoLocation = autolocation;
                    $scope.$apply();
                });
            } else {
               this.inputErrorMessage = "Geolocation is not supported by this browser.";
               this.manualInputOpen = true;
               this.autoFindOpen = false;
            }
        }

        this.selectAutoLocation = () => {
            const currentCityList = this.currentCityList;
            const city = this.autoLocation;
            for (let i = 0; i < currentCityList.length; i++) {
                if (currentCityList[i].name === city) {
                    cityData.setCityData(currentCityList[i].name, currentCityList[i].id);
                    this.cityName = currentCityList[i].name;
                    this.cityAssigned = true;
                    this.manualInputOpen = false;
                    this.autocompleteOpen = false;
                    this.autoLocation = '';
                    this.getWeatherData();
                    return;
                }
            }
        }
    }
  });