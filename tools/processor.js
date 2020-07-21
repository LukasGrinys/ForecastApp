const fs = require('fs');

fs.readFile('current.city.list.json', 'utf-8', (err, data) => {
    if (!err && data) {
        let cities = JSON.parse(data);
        let result = [];
        for (let i = 0; i < cities.length; i++) {
            let city = cities[i]
            let obj = {
                id: city.id,
                name: city.name,
                coord: {
                    lon: city.coord.lon,
                    lat: city.coord.lat
                }
            }
            result.push(obj);
        };
        let dataToWrite = JSON.stringify(result);
        fs.writeFile('currentCitylistReduced.json', dataToWrite, (err) => {
            if (!err) {
                console.log("Success")
            } else {
                console.log(err);
            }
        })
    } else {
        console.log(err)
    }
})


// {
//     "id": 833,
//     "name": "Ḩeşār-e Sefīd",
//     "state": "",
//     "country": "IR",
//     "coord": {
//       "lon": 47.159401,
//       "lat": 34.330502
//     }
//   },