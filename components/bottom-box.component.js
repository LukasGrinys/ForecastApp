angular.module('forecastApp').component('bottomBox', {
    templateUrl : 'components/bottom-box.component.html',
    bindings: {
        fivedaydata : '<',
        updateDisplayedData : '&'
    },
    controller: function BottomBoxController($scope, $sce) {
        this.forecastHourIndex = 0;
        this.thumbnailData = [];

        this.returnSliderGrid = () => {
            let dataArr = $scope.$parent.fiveDayData;
            if (dataArr.length === 0) return null;
            let html = '';
            const indexes = [0,10,20,30,39];
            for (let i = 0; i < indexes.length; i++) {
                html += `<div class="slider-grid-point">
                    <span>${dataArr[indexes[i]].dt_txt.slice(10,16)}</span>
                    <span>${dataArr[indexes[i]].dt_txt.slice(5,10)}</span>
                </div>`
            };
            return $sce.trustAsHtml(html);
        }

        this.forecastRangeHandler = () => {
            if (this.fivedaydata.length === 0) return;  
            const hour = this.forecastHourIndex;
            const data = this.fivedaydata[hour];
            const dataObj = {
                temperature: data.main.temp,
                icon: data.weather[0].icon,
                id: data.weather[0].id,
                description: helpers.capitalize(data.weather[0].description),
                wind: data.wind.speed.toFixed(1),
                date: helpers.returnDateString(data.dt_txt.slice(5,10)),
                time: data.dt_txt.slice(11,16),
                weekDay: helpers.returnWeekDay(data.dt_txt.slice(0,10))
            }
            this.updateDisplayedData({ dataObj:dataObj });
        }

        this.setForecastHourIndex = (index) => {
            this.forecastHourIndex = index;
            this.forecastRangeHandler();
        }
        this.returnDayBoxContent = (icon, temperature) => {
            if (icon === 'dataobj.icon') return null;
            let unitString = weatherService.data.units === 'metric' ? '°C' : '°F';
            return $sce.trustAsHtml(`
            <img class="day-box-icon" src="/public/icons/${icon}.png">
            <div class="day-box-temp">${temperature} <span style="font-weight:300;font-size:0.8rem">${unitString}</span></div>
            `);
        } 

        this.$onInit = function() {
            this.forecastHourIndex = 0;
            this.thumbnailData = helpers.formFiveDayThumbnailData(this.fivedaydata);
        };
    }
})