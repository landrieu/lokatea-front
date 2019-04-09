import React, { Component } from "react";
import Map from "../leaflet/LeafletSource";
import SearchBox from "../searchBox/SearchBox";
import Parameters from "../../services/parameters";
import axios from "axios";

export default class MapSearch extends Component {
  constructor() {
    super();
    this.state = {
      coord: Parameters.mapDefaultParameters.coordinates
    };

    this.getSuggestionValue = this.getSuggestionValue.bind(this);
  }

  getSuggestionValue(suggestion) {
    console.log("Suggestion= ", suggestion);
    var params = {
      f: "json",
      magicKey: suggestion.magicKey
    };

    axios
      .get(
        `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates`,
        { params }
      )
      .then(res => {
        console.log("GPS= ", res.data.candidates[0].location);
        this.setState({
          coord: [
            res.data.candidates[0].location.y,
            res.data.candidates[0].location.x
          ]
        });
      });

    return suggestion.text;
  }

  render() {
    return (
      <div>
        <SearchBox getSuggestionValue={this.getSuggestionValue} />
        <Map coord={this.state.coord} />
      </div>
    );
  }
}
