import React, { Component } from "react";
import L from "leaflet";
//import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import axios from "axios";
import Parameters from "../../services/parameters";
import Request from "../../services/requests";
import Icons from "../../services/icons.js";

import "./leaflet.css";
import { func } from "prop-types";

export default class Leaflet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      places: [],
      placesCategories: Parameters.placesTypes,
      mapDefaultParameters: Parameters.mapDefaultParameters
    };
  }
  componentDidMount() {
    var mapParameters = this.state.mapDefaultParameters;
    var baseLayers = {};

    //Define map styles
    let mapStyles = mapParameters.mapStyles;
    mapStyles.forEach(style => {
      baseLayers[style] = L.tileLayer(mapParameters.mapURL, {
        id: "mapbox." + style,
        attribution: mapParameters.mapLink
      });
    });

    //Define map boundaries
    let bounds = L.latLngBounds(
      mapParameters.boundaries[0],
      mapParameters.boundaries[1]
    );

    //Create map
    this.map = L.map("map-container", {
      center: this.props.coord,
      zoom: mapParameters.zoom,
      minZoom: mapParameters.minZoom,
      layers: [baseLayers[Object.keys(baseLayers)[0]]],
      maxBounds: bounds,
      maxBoundsViscosity: mapParameters.maxBoundsViscosity
    });

    //Add layers to the map
    L.control.layers(baseLayers).addTo(this.map);

    this.Markers.getAllCategories();
  }

  componentDidUpdate(prevProps, prevState) {
    // check if data has changed
    console.log("prevProps:", prevProps);
    console.log("prevState:", prevState);
    if (this.state.places !== prevState.places) {
      this.Markers.addCategoriesLayers(this.state.places);
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("nextProps:", nextProps);
    this.map.setView (
      nextProps.coord
    );
  }

  Markers = {
    places: [],
    category: "",
    center: "",
    markers: [],
    layerGroups: [],
    layers: [],
    that: this,

    init: function(category) {
      console.log("INIT");
      this.category = category;

      this.markers = [];
    },

    getAllCategories: () => {
      Request.ResearchPlaces.getAllPlaces(
        this.props.coord,
        this.state.placesCategories,
        {},
        places => {
          this.setState({ places: places });
        }
      );
    },

    addCategoriesLayers: places => {
      var placesCategories = [];
      var icon, iconName, iconObj, iconPath = "/images/logos/";
      var LeafIcon = L.Icon.extend({
        options: {
            iconSize:     [38, 95],
            iconAnchor:   [22, 94]
        }
    });

      for (var category in places) {
        for (var i = 0; i < places[category].length; i++) {
            let place = places[category][i];
            console.log("AA:", category);
            console.log("ICONS:", place.attributes.Type);
             
            icon = undefined;
            if(Icons[category]){
                iconObj = {};
                iconObj = Object.create(Icons[category]);
                iconObj.iconUrl = iconPath + iconObj.iconUrl;
                icon = L.icon(iconObj);
            }
            

            
            placesCategories.push(
                L.marker([place.location.y, place.location.x], icon ? {icon: icon} : null).bindPopup(
                    this.Markers.getPopupHTML({
                        title: place.attributes.PlaceName,
                        text: place.attributes.Place_addr,
                        info: {
                            address: place.attributes.Place_addr,
                            type: place.attributes.Type,
                            phone: place.attributes.Phone,
                            url: place.attributes.url,
                            longLabel: place.attributes.LongLabel
                        },
                        image: ""
                    })
                )
          );
        }

        this.Markers.layers[category] = L.layerGroup(placesCategories);
        placesCategories = [];
      }
    },

    toggleCategory: (category, event) => {
      var element = event.target;
      element.classList.toggle("selected");

      var displayLayer = element.classList.contains("selected");

      if (this.Markers.layers[category]) {
        if (displayLayer) {
          this.map.addLayer(this.Markers.layers[category]);
        } else {
          this.Markers.removeLayer(
            this.Markers.layers[category],
            null,
            this.map
          );
        }
      }
    },

    setPlaces: function() {
      this.places.forEach((place, i) => {
        this.markers.push({
          key: "marker " + place.address + " " + i,
          position: [place.location.y, place.location.x],
          content: {
            title: place.attributes.PlaceName,
            text: place.attributes.Place_addr,
            image: ""
          }
        });
      });

      this.setMarkers(this.markers);
    },

    setMarkers: function() {
      for (let i = 0; i < this.markers.length; i++) {
        // add marker
        this.setMarker(
          this.markers[i].position,
          this.that.layer,
          this.markers[i].content
        );
      }
    },

    setMarker: function(marker, layer, popup) {
      var markerCtrl = L.marker(marker).addTo(layer);

      if (popup) {
        markerCtrl.bindPopup(this.getPopupHTML(popup));
      }

      return markerCtrl;
    },

    getPopupHTML: function(popup) {
      var html = "";
      if (popup.title) {
        html += "<h4>" + popup.title + "</h4>";
      }
      if (popup.text) {
        html += "<p>" + popup.text + "</p>";
      }
      /*if(popup.info){
                popup.info.forEach((info) => {
                    html += "<p>" + info + "</p>";
                });
            }*/
      return html;
    },

    removeLayer: function(layer, removeAll, map) {
      if (removeAll) {
        this.Markers.layers.forEach(l => {
          map.removeLayer(l);
        });
      } else if (layer) {
        map.removeLayer(layer);
      }
    },

    clearLayer: function(layer, clearAll) {
      if (clearAll) {
        this.Markers.layers.forEach(l => {
          l.clearLayers();
        });
      } else if (layer) {
        layer.clearLayers();
      }
    }
  };

  render() {
    return (
      <div>
        <button
          type="button"
          onClick={this.Markers.removeLayer.bind(null, true, this.map)}
        >
          Click Me!
        </button>
        <div id="select-categories">
          {this.state.placesCategories.map((cat, i) => {
            return (
              <div
                className="select-categories-div"
                key={i + " " + cat}
                style={{
                  width:
                    "calc(50% / " + this.state.placesCategories.length + ")"
                }}
                onClick={this.Markers.toggleCategory.bind(this, cat)}
              >
                {cat}
              </div>
            );
          })}
        </div>
        <div id="map-container" />
      </div>
    );
  }
}
