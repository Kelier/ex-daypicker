import React, { Component } from 'react';
import './App.css';

// import * as THREE from 'three';
import DayPicker from './modules/DayPicker';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="slogan">DayPicker.js</div>
        <DayPicker></DayPicker>
      </div>
    );
  }
}

export default App;
