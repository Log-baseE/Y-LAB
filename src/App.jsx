import React, { Component } from "react";
import Index from "./index/Index";
import ProgressScreen from './progress/ProgressScreen';

import "./App.scss";

class App extends Component {
  state = {
    stage: 0,
    options: null
  }

  handleSubmit = options => event => {
    this.setState({
      stage: this.state.stage + 1,
      options: options
    });
  }

  handlePrevious = event => {
    this.setState({
      stage: this.state.stage - 1,
    });
  }

  renderScreen = () => {
    let screens = [
      <Index state={this.state.options} handleSubmit={this.handleSubmit} key="index"/>,
      <ProgressScreen options={this.state.options} handlePrevious={this.handlePrevious} key="progress"/>
    ];
    return screens[this.state.stage]
  }

  render() {
    return (
      this.renderScreen()
    );
  }
}

export default App;
