import React, { Component } from "react";

//Components
import Filters from "./components/filters/Filters";
//import Map from './components/leaflet/Leaflet';
//import Map from './components/map/Map';

import "./App.css";
import MapSearch from "./components/mapSearch/MapSearch";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Filters />
        <MapSearch />

        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
      </div>
    );
  }
}

export default App;
