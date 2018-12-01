import React, { Component } from "react";
import logo from "./logo.svg";
import Index from "./index/Index";
import "./App.scss";



class App extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <Index />
    );
  }
}

export default App;
