import React, { Component } from "react";
import Index from "./index/Index";
import ProgressScreen from './progress/ProgressScreen';
import ResultScreen from './result/ResultScreen';

import "./App.scss";

const electron = window.require('electron');
const { remote } = electron;
const path = remote.require('path');
const fs = remote.require('fs');

class App extends Component {
  state = {
    stage: 0,
    options: null,
    result: {
      file: {
        path: path.join(remote.app.getAppPath(), './.ylab/out_video.mp4'),
        size: 123456789,
      },
      objects: [
        'a', 'b', 'c'
      ],
      frames: [],
      count_per_frame: 5.6,
      type: 'default',
      car_count: null,
    },
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

  handleResult = result => event => {
    this.setState({
      stage: this.state.stage + 1,
      result: JSON.parse(fs.readFileSync(remote.app.getPath('.ylab/data.json'), 'utf8')),
    });
  }

  handleRestart = event => {
    this.setState({
      stage: 0
    });
  }

  renderScreen = () => {
    let screens = [
      <Index state={this.state.options} handleSubmit={this.handleSubmit} key="index"/>,
      <ProgressScreen options={this.state.options} handlePrevious={this.handlePrevious} key="progress"/>,
      <ResultScreen result={this.state.result} handleRestart={this.handleRestart} key="results"/>,
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
