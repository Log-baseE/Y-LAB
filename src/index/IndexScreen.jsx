import React, { Component } from "react";
import { Grid } from '@material-ui/core';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import SplitPane from "react-split-pane";
import Settings from "./Settings";
import Preview from "./Preview";
import Topbar from "./Topbar";

class IndexScreen extends Component {
  state = {
    file: null,
    meta: null,
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
    roiType: "all",
    roi: {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 0, y: 0 },
      bottomLeft: { x: 0, y: 0 },
      bottomRight: { x: 0, y: 0 }
    }
  };

  names = {};

  componentDidMount() {
    const { state } = this.props;
    if ( state ) {
      this.setState({
        ...state
      });
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSliderChange = (name, min, max) => (event, value) => {
    this.setState({ [name]: value });
    if (!this.names[name]) {
      this.names[name] = `lastValid${name.charAt(0).toUpperCase() +
        name.slice(1)}`;
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
    this.setState({ roi });
  };

  handleFileChange = event => {
    this.setState({
      file: event.target.files[0]
    });
  };

  handleFileDrop = files => {
    this.setState({
      file: files[0]
    });
  };

  handleMetaData = event => {
    this.setState({
      meta: {
        duration: event.target.duration,
        res: {
          width: event.target.videoWidth,
          height: event.target.videoHeight,
        }
      },
      roi: {
        topLeft: {x: 0, y: 0},
        topRight: {x: event.target.videoWidth, y: 0},
        bottomLeft: {x: 0, y: event.target.videoHeight},
        bottomRight: {x: event.target.videoWidth, y: event.target.videoHeight},
      }
    })
  }

  render() {
    const { handleSubmit, handleSave } = this.props;
    return (
      <Grid container direction="column" alignItems="stretch" style={{
        height: '100vh'
      }}>
        <Grid item>
          <Topbar />
        </Grid>
        <Grid item>
          <SplitPane split="vertical" minSize={500} maxSize={700} defaultSize={"50%"} style={{
            height: 'calc(100vh - 64px)',
          }}>
            <PerfectScrollbar option={{ suppressScrollX: true }}>
              <Settings
                state={this.state}
                handleSliderChange={this.handleSliderChange}
                handleNumberInputChange={this.handleNumberInputChange}
                handleChange={this.handleChange}
                handleROIChange={this.handleROIChange}
                handleFileChange={this.handleFileChange}
                validateValue={this.validateValue}
              />
            </PerfectScrollbar>
            <PerfectScrollbar>
              <Preview 
                state={this.state}
                handleFileDrop={this.handleFileDrop}
                handleMetaData={this.handleMetaData}
                handleSubmit={handleSubmit}
                handleSave={handleSave}
              />
            </PerfectScrollbar>
          </SplitPane>
        </Grid>
      </Grid>
    );
  }
}

export default IndexScreen;
