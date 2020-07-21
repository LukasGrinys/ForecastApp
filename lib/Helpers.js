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
        let dateMap = [];
        let results = [];
        for (let i = 0; i < array.length; i++) {
            let dateString = array[i].dt_txt;
            if (results.length === 5) {
                break;
            }
            if (i === 0 || ( dateString.slice(11,16) === "12:00" && dateMap.indexOf(dateString.slice(0,10)) === -1 ) 
            || ( i === array.length - 1 && results.length === 4 ) ) {
                dateMap.push(array[i].dt_txt.slice(0,10));
                let dataObj = {
                    date: array[i].dt_txt.slice(5,10),
                    time: array[i].dt_txt.slice(11,16),
                    weekDay: this.returnWeekDay(array[i].dt_txt.slice(0,10)),
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
        day = parseInt(day);
        if (day === 1) {
            dayString = day + 'st'
        } else if (day === 2) {
            dayString = day + 'nd'
        } else if (day === 3) {
            dayString = day + 'rd'
        } else {
            dayString = day + 'th'
        }
        return `${map[month]} ${dayString}`
    }

    capitalize(string) {
        return string.slice(0,1).toUpperCase() + string.slice(1);
    }

    returnWeekDay(string) {
        let year = parseInt(string.slice(0,4));
        let month = parseInt(string.slice(5,7)) - 1;
        let day = parseInt(string.slice(8,10));
        let d = new Date(year, month, day);
        let weekDayIndex = d.getDay();
        let weekDay = this.returnWeekDayFromindex(weekDayIndex);
        return weekDay;
    }

    returnWeekDayFromindex = (index) => {
        switch( index ) {
            case 1 :
                return "Monday"
            case 2 :
                return "Tuesday"
            case 3 :
                return "Wednesday"
            case 4 :
                return "Thursday"
            case 5 :
                return "Friday"
            case 6 :
                return "Saturday"
            case 0 :
                return "Sunday"
            default :
                return undefined
        }
    }

    convertMilisecondsToDate(unix) {
        let d = new Date(unix * 1000);
        let hours = d.getHours() > 9 ? d.getHours().toString() : "0" + d.getHours();
        let minutes = d.getMinutes() > 9 ? d.getMinutes().toString() : "0" + d.getMinutes();
        let time = hours + ":" + minutes;
        let weekDay = this.returnWeekDayFromindex(d.getDay());
        let obj = {
            time,
            weekDay
        }
        return obj;
    }

    returnTimeZone() {
        let offset = new Date().getTimezoneOffset();
        let hours = offset / -60;
        if (hours > 0) {
            return 'UTC+' + Math.abs(hours);
        } else if (hours < 0) {
            return 'UTC-' + Math.abs(hours);
        } else {
            return 'UTC'
        }
    };
}

var helpers = new Helpers();var helpers = new Helpers();