angular.module("forecastApp").component('unitsContainer', {
    templateUrl: 'components/units-container.component.html',
    bindings: {
        getWeatherData : "&"
    },
    controller: function UnitsController(weatherService) {
        this.units = weatherService.data.units;

        this.changeUnits = (units) => {
            if (units === weatherService.data.units) return;
            weatherService.changeUnits(units);
            this.getWeatherData();
            this.units = weatherService.data.units;
        }
    }
})

