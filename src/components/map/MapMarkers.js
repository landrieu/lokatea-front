import { useState, useEffect } from 'react';
import { loadModules } from '@esri/react-arcgis';

const Gaphic = (props) => {

    function addMarkers(places){
        var points = [];
        for(let i = 0; i < places.length; i++){
            points.push({
                type: "point",
                longitude: places[i].location.x,
                latitude: places[i].location.y,
            });
        }

        return points;
    }

    function getAttributes(places){
        var attributes = [];
        for(let i = 0; i < places.length; i++){
            attributes.push({
                Name: "Keystone Pipeline",
                Owner: "TransCanada",
                Length: "3,456 km"
            })
        }
    }

    function getMarkerSymbol(){
        var markerSymbol = {
            type: "simple-marker", // simple-marker | picture-marker | simple-line | cartographic-line-symbol | simple-fill | picture-fill | text | shield-label-symbol | point-3d | line-3d | polygon-3d | mesh-3d | label-3d
            color: [226, 119, 40],
            outline: {
                color: [255, 255, 255],
                width: 2
            }
        };

        return markerSymbol;
    }

    const [pointGraphic, setGraphic] = useState(null);
    useEffect(() => {

        loadModules(["esri/Map", "esri/views/MapView", "esri/Graphic", "esri/symbols/Symbol"]).then(([Map, MapView, Graphic, Symbol]) => {
            
            var places = props.places;

            if(places && places.length === 0){
                console.log("PLACES: NULL");
            }else if(places){
                console.log("PLACES: FULL");
                // Add the geometry and symbol to a new graphic
                var points = addMarkers(places);
                var attributes = getAttributes(places);
                var markerSymbol = getMarkerSymbol();

                for(let i = 0; i < points.length; i++){
                    var pointGraphic = new Graphic({
                        geometry:   points[i],
                        symbol:     markerSymbol, 
                        attributes: places[i].attributes,
                        popupTemplate: {
                            title: "PlaceName",
                            content: [
                              {
                                type: "fields",
                                fieldInfos: [
                                  {
                                    fieldName: "PlaceName"
                                  },
                                  {
                                    fieldName: "Place_addr"
                                  }
                                ]
                              }
                            ]
                        }
                    });
                    setGraphic(pointGraphic);
                    props.view.graphics.add(pointGraphic);
                }

            }else{
                console.log("PLACES: UNDEFINED");
            }
            
        }).catch((err) => console.error(err));

        return function cleanup() {
            props.view.graphics.remove(pointGraphic);
        };
    }, []);

    return null;

}

export default Gaphic;