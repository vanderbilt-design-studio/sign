import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <h2>Design Studio</h2>
        <h1>Closed</h1>
        <h3>{new Date().toLocaleString('en-US')}</h3>
      </div>
    );
  }
}

export default App;
