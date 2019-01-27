$(document).ready(function () {
    /*display map*/
    let locations = [];
    let labels = [];
    let data = [];
    /*get data from routes*/
    $.getJSON('/locations', (d) => {
        locations = d
    })
    $.getJSON('/labels', (d) => {
        labels = d
    });
    $.getJSON('/data', (d) => {
        data = d
    })

    setTimeout(() => {
        /*create new map with positions and  labels obtained via routes*/
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: { lat: 60.17087, lng: 24.941583 }
        });
        var markers = locations.map(function (location, i) {
            return new google.maps.Marker({
                position: location,
                label: labels[i % labels.length]
            });
        });
        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(map, markers,
            { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
    }, 500)


    /*display median based on user query*/
    $("#form").on("submit", (e) => {
        e.preventDefault()
        let result = []
        /*from data of pick up time, filter the one that includes correct time details and push the result to array result*/
        data.slice(1)
            .filter(e => e.timestamp.indexOf($("#date").val()) !== -1 && e.timestamp.indexOf($("#interval").val() + ":") === 11)
            .forEach(e => {
                if (!result[e.location_id]) result[e.location_id] = []
                result[e.location_id].push(Number(e.pickup_time))
            })
        let newResult = calculateMedian(result)
        $("#result").text("")
        /*create a table for the median display*/
        let text = "<table><tr><th>Pick up Number</th><th>Median</th></tr>"
        for (let key in newResult) {
            text += `<tr><td> ${newResult[key][0]}</td><td> ${newResult[key][1]}</td></tr>`
        }
        text += "</table>"
        $("#result").append(text)
    })

});

