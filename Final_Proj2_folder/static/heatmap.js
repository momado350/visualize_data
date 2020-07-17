var apiKey = "pk.eyJ1IjoiZXZhbnMyNDUzIiwiYSI6ImNrOXpxeWplMTBldTQzZnJ5NGhsNjJ5NHgifQ.v6AFZ_73NGDIkP5Wx_4kMQ";

var heatmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",

  maxZoom: 18,

  id: "mapbox.streets",
  accessToken: apiKey
});
// Create the map object with options.
var map = L.map("myMap", {
  center: [
    40.7, -94.5
  ],

  zoom: 3

});

// add tile layer to the map.
heatmap.addTo(map);

// get geoJSON data.
d3.json("http://127.0.0.1:5000/api/v1.0/over45percent", function(data) {
  console.log("mydata")
  console.log(data)

  //style and retrieve obesity percentage
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor((feature.properties.obesitypercentage)),
      color: "#000000",
      radius: getRadius(feature.properties.obesitypercentage),
      stroke: true,
      weight: 0.5
    };
  }

  // define color based on obesity percentage.
  function getColor(obeselevel) {
    switch (true) {
    case obeselevel > 55:
      return "#ea2c2c";
    case obeselevel > 50:
      return "#ea822c";
    case obeselevel > 45:
      return "#ee9c00";
    case obeselevel > 40:
      return "#eecc00";
    case obeselevel > 35:
      return "#98ee00";
    default:
      return "#008000";
    }
  }

  //calculate the radius
  function getRadius(obeselevel) {
    if (obeselevel === 40) {
      return 1;
    }

    return obeselevel/5;
  }

  
  L.geoJson(data, {
    pointToLayer: function(feature, city) {
      return L.circleMarker(city);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("State: " + feature.properties.statename + "<br>City: " + feature.properties.cityname 
      +"<br>Percentage Obese: " + feature.properties.obesitypercentage
      + "<br>City Population in 2010: " + feature.properties.Population2010+ "<br>Year of Study: " + feature.properties.year);
    }
  }).addTo(map);

  //https://github.com/k4r573n/leaflet-control-osm-geocoder
  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});
  
  var osmGeocoder = new L.Control.OSMGeocoder({placeholder: 'Search location...'});

  map.addControl(osmGeocoder);

  // Legend
  var legend = L.control({
    position: "bottomright"
  });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [30,35,40,45, 50,55];
    var colors = [
      "#008000",
      "#98ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + grades[i] + (grades[i + 1] ? //"&ndash;" + grades[i + 1] +
       "<br>" : "+"
        );
    }
    return div;
  };

  legend.addTo(map);
});
