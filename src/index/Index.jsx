import React, { Component } from "react";
import SplitPane from "react-split-pane";
import Settings from "./Settings";
import Preview from "./Preview";

class Index extends Component {
  state = {
    type: "default",
    nnModel: "default",
    weights: "default",
    thresholdType: "default",
    threshold: 0.1,
    lastValidThreshold: 0.1,
    gpuType: "default",
    gpu: 70,
    lastValidGpu: 70,
    filterType: "all",
    filter: "",
    roiType: "custom",
    roi: {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 0, y: 0 },
      bottomLeft: { x: 0, y: 0 },
      bottomRight: { x: 0, y: 0 },
    }
  };

  names = {}

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSliderChange = (name, min, max) => (event, value) => {
    this.setState({ [name]: value });
    if(!this.names[name]) {
      this.names[name] = `lastValid${name.charAt(0).toUpperCase() + name.slice(1)}`;
    }
    this.setState({
      [this.names[name]]: value
    });
  };

  handleNumberInputChange = (name, min, max) => event => {
    this.setState({ [name]: event.target.value });
    if (!isNaN(parseFloat(event.target.value))) {
      var val = parseFloat(event.target.value);
      if (val >= min && val <= max) {
        this.setState({
          [`lastValid${name.charAt(0).toUpperCase() + name.slice(1)}`]: val
        });
      }
    }
  };

  validateValue = (key, format) => {
    return format.test(this.state[key]);
  };

  handleROIChange = (position, component) => event => {
    let roi = Object.assign({}, this.state.roi);
    roi[position][component] = event.target.value;
    this.setState({roi});
  }

  render() {
    return (
      <SplitPane split="vertical" minSize={500} defaultSize={"50%"}>
        <Settings 
          state={this.state} 
          handleSliderChange={this.handleSliderChange}
          handleNumberInputChange={this.handleNumberInputChange}
          handleChange={this.handleChange}
          handleROIChange={this.handleROIChange} />
        <Preview />
      </SplitPane>
    );
  }
}

export default Index;
