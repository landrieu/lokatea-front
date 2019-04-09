import React, { Component, useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { Scene, Map } from '@esri/react-arcgis';
import MapGraphic from './MapGraphic';
import MapMarkers from './MapMarkers';
import axios from 'axios';

import './map.css';

const coord = {
    'sydney': [151.206990, -33.867487],
    'paris': [2.3522, 48.8566]
};

export default class CustomMap extends Component {

    state = {
       defaultCoord: coord.paris,
       basemap: 'streets-navigation-vector',
       markers: [],
       places: []
    }

    componentDidMount(){
        var places = ["Parks and Outdoors", "Food", "Hotel"];
        this.findPlaces(places[1], this.defaultCoord);
    }

    convertRequestParams = (params) => {
        var formattedParams;

        for(var k in params){
            formattedParams = formattedParams ? formattedParams + "&" : "";
            if(typeof params[k] === 'object'){
                formattedParams += (k + '=' + JSON.stringify(params[k]));
            }else{
                formattedParams += (k + '=' + params[k]);
            }
        }

        return formattedParams;
    }

    findPlaces = (type, center) => {

        var location = {"spatialReference": {"wkid":4326}, "x": this.state.defaultCoord[0], "y": this.state.defaultCoord[1]};

        var params = this.convertRequestParams({
            f: 'json',
            outFields: "Place_addr,PlaceName",
            category: type,
            location: location,
            maxLocations: 100
        });

        var url = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates";



        axios.get(url + '?' + params)
            .then(res => {
                console.log('P', res.data.candidates);
                this.setState({places: res.data.candidates});
        });

    }

    addMarkers = (data) => {
        var point;
        var places = data.candidates;
        for(let i = 0; i < places.length; i++){
            point = {
                type: "point",
                longitude: places[i].location.x,
                latitude: places[i].location.y,
            }
        }

        var markerSymbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            color: [226, 119, 40],
            outline: {
                color: [255, 255, 255],
                width: 2
            }
        };
    }

    render() {
        return(
            <div id="map-container">

                <Scene class="full-screen-map"
                style={{ width: '100%', height: '100vh' }}
                mapProperties={{basemap: this.state.basemap}}
                viewProperties={{
                    center: this.state.defaultCoord,
                    zoom: 6
                }}
                >
                    
                    <MapMarkers places={this.state.places} />
                </Scene>
            </div>
        )
    }
}
                //<MapGraphic />
                /*<Scene
                    style={{ width: '100%', height: '100vh' }}
                    mapProperties={{ basemap: 'streets', color: "#FF0000" }}
                    viewProperties={{
                        center: [151.206990, -33.867487],
                        zoom: 6
                    }}
                />*/

/*ReactDOM.render(
  <Map />,
  document.getElementById('container')
);*/




