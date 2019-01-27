const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const convert = require("csv-to-array")
let locations = ["location_id", "lng", "lat"]
let pickup_times = ["location_id", "timestamp", "pickup_time"];
let data
let labels = []
let location = []
/*convert csv to array*/
convert({
    file: "locations.csv",
    columns: locations
}, function (err, array) {
    /*when receiving an array from locations.csv, first sort it based on location id. 
    Then push id into array labels for the number display in map
    Then push latitude and longtitude of each position to location array for the location display in map*/
    location = array.slice(1).sort((a, b) => {
        Number(a.location_id) > Number(b.location_id)
    }).map(e => {
        labels.push(e.location_id)
        return { "lat": Number(e.lat), "lng": Number(e.lng) }
    });

})
/*read the pickup_times.csv and put into an array named data*/
convert({
    file: process.argv[2],
    columns: pickup_times
}, function (err, array) {
    data = array
});

/*building routes and set get request for each json*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/*check routes*/
app.use(function (req, res, next) {
    console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
    next();
});

app.use(express.static("./public"));

app.use(cors());
/*route for location longtitue and latitude*/
app.get("/locations", function (req, res) {
    res.json(location);
});
/*route for location label*/
app.get("/labels", function (req, res) {
    res.json(labels);
});
/*route for pick up times information*/
app.get("/data", function (req, res) {
    res.json(data);
});
app.listen(process.env.PORT || 8000);

console.log("Express app running on port "+ process.env.PORT || 8000);

module.exports = app;