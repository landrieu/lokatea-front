const southWest = [-89.98155760646617, -180];
const northEast = [89.99346179538875, 180];
const coordinates = {
    sydney: [-33.867487, 151.206990],
    home: [-33.88365220600338, 151.1835484319529],
    paris: [48.8566, 2.3522],
    toulouse: [43.6047, 1.4442]
};

//Full list on: https://developers.arcgis.com/rest/geocode/api-reference/geocoding-category-filtering.htm#ESRI_SECTION1_502B3FE2028145D7B189C25B1A00E17B
//Examples: ["Nightlife Spot", "Professional and Other Places", "Residence", "Shops and Service", "Travel and Transport", "Water Features", "Japanese Food", "POI"*/],
const placesTypes = ["Parks and Outdoors", "Food", "Hotel", "Residence"];

const mapLink   = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const mapURL    = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=sk.eyJ1IjoiZmxhdGxvYyIsImEiOiJjanUwaXgyNWQzZ2EzNGVsbDkzOHRscmcyIn0.0zG8kBXwM-3JG5LRPBG3UA';
const mapStyles = ["streets", "streets-satellite", "run-bike-hike", "emerald"] /*["streets","light","dark","satellite","streets-satellite","wheatpaste","streets-basic","comic","outdoors","run-bike-hike","pencil","pirates","emerald","high-contrast"];*/

export default {
    placesTypes: placesTypes,
    mapDefaultParameters:{
        coordinates: coordinates.toulouse,
        boundaries: [southWest, northEast],
        zoom: 13,
        minZoom: 1,
        maxBoundsViscosity: 1.0,
        mapLink: mapLink,
        mapURL : mapURL,
        mapStyles: mapStyles
    },
}

