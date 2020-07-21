angular.module('forecastApp').component('mainBox', {
    templateUrl: 'components/main-box.component.html',
    bindings: {
        displayedWeatherData : '<',
        forecastLoading : '<',
        showingCurrent : '<',
        showCurrent : '&'
    },
    controller: function MainBoxController($sce) {
        this.something = '';
        this.timeZone =  helpers.returnTimeZone();

        this.returnMainBoxContent = (icon, temperature) => {
            if (icon === undefined || temperature === undefined || this.forecastLoading) return null;
            let unitString = weatherService.data.units === 'metric' ? '°C' : '°F';
            return $sce.trustAsHtml(`
            <div class="main-box-temperature flex-center">${temperature.toFixed()} 
            <span style="font-size:2.5rem">${unitString}</span> </div>
            <img class="main-box-icon" src="/public/icons/${icon}.png">
            `);
        } 

    }
});