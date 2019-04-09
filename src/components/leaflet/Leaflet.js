import React, { Component, Fragment } from 'react'
import { Map, TileLayer, Marker, Popup, Mu } from 'react-leaflet';
//import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import axios from 'axios';

import './leaflet.css';

const coord = {
    'sydney': [-33.867487, 151.206990],
    'home': [-33.88365220600338, 151.1835484319529],
    'paris': [2.3522, 48.8566]
};

type Position = [number, number]

type Props = {
  content: string,
  position: Position,
}

type MarkerData = { ...Props, key: string }

const MyPopupMarker = ({ content, position }: Props) => (
  <Marker position={position} draggable='false'>
    <Popup>{content}</Popup>
  </Marker>
)

const MyMarkersList = ({ markers }: { markers: Array<MarkerData> }) => {
  const items = markers.map(({ key, ...props }) => (
    <MyPopupMarker key={key} {...props} />
  ))
  return <Fragment>{items}</Fragment>
}

type State = {
  markers: Array<MarkerData>,
}
export default class Leaflet extends Component {

    state = {
        defaultCoord: coord.home,
        markers: [],
        places: [],
        placesCategories: ["Parks and Outdoors", "Food", "Hotel"],
        lat: 51.505,
        lng: -0.09,
        zoom: 13,
        markers: [],
    }

    componentDidMount(){
        var places = ["Parks and Outdoors", "Food", "Hotel"];
        this.findPlaces(places[2]);
        console.log(Popup);
    }

    getInterestPlaces = () => {

    } 

    findPlaces = (type, center) => {
        var center = center || this.state.defaultCoord;
        var location = {"spatialReference": {"wkid":4326}, "x": center[1], "y": center[0]};
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
                this.setPlaces();
        });
    }

    setPlaces = () => {
        var markers = [];
        this.state.places.forEach((place, i) => {
            markers.push({
                key:        'marker ' + place.address + ' ' + i,
                position:   [place.location.y, place.location.x],
                content:    '<b>' + place.attributes.PlaceName + '</b>'
            });
        });

        this.setState({markers});
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


    render() {
        return (
            <div id="map-container">
                <Map center={this.state.defaultCoord} zoom={13}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MyMarkersList markers={this.state.markers} />
                </Map>
            </div>
        )
    }
}
 



