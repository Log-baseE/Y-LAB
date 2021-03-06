import React, { Component } from "react";
import { Grid } from '@material-ui/core';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SplitPane from "react-split-pane";
import Settings from "./Settings";
import Preview from "./Preview";
import Topbar from "./Topbar";
import Joyride, { ACTIONS, EVENTS } from 'react-joyride';

const { ipcRenderer } = window.require('electron');

const joyrideStyles = {
  options: {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Bahnschrift Light', 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif`,
    primaryColor: '#9A67EA',
  }
}
class IndexScreen extends Component {
  state = {
    file: null,
    meta: null,
    algorithm: "madeleine",
    type: "default",
    nnModel: "default",
    weights: "default",
    thresholdType: "default",
    threshold: 0.1,
    lastValidThreshold: 0.1,
    gpuType: "default",
    gpu: 70,
    lastValidGpu: 70,
    pixelThresholdType: "default",
    pixelThreshold: 50,
    lastValidPixelThreshold: 50,
    timeThresholdType: "default",
    timeThreshold: 5,
    direction: "vertical",
    lastValidTimeThreshold: 5,
    lanes: {
      count: 5,
      shoulderSize: 0,
      perspectiveScaling: 1
    },
    filterType: "all",
    filter: "",
    roiType: "all",
    roi: {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 0, y: 0 },
      bottomLeft: { x: 0, y: 0 },
      bottomRight: { x: 0, y: 0 }
    },
    tempROI: {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 0, y: 0 },
      bottomLeft: { x: 0, y: 0 },
      bottomRight: { x: 0, y: 0 }
    },
    steps: [
      {
        title: <h2>Welcome to Y-LAB!</h2>,
        target: '#index-screen',
        content:  (<p>We will be guiding you through the app's main features.<br />If you know what you're up to, simply press the 'Skip' button at any time</p>),
        disableBeacon: true,
        placement: 'center',
        styles: {
          options: {
            width: 500,
          }
        }
      },
      {
        target: '#basic-settings',
        title: 'Basic settings',
        content: <p>Here is where you choose the video file you're going to use</p>,
        placement: 'auto',
        placementBeacon: 'right',
        disableOverlay: false,
      },
      {
        target: '#advanced-settings',
        title: 'Advanced settings',
        content: <p>Here is where you configure additional settings for the object detection engine</p>,
        placement: 'auto',
        placementBeacon: 'right',
      },
      {
        target: '#preview-card',
        title: 'Preview window',
        content: <p>You can drop a video file here. When a video file is chosen, it will automatically preview the video you uploaded</p>,
        placement: 'auto',
        placementBeacon: 'left',
      },
      {
        target: '#submit-button',
        content: <p>When you think you're done, press this and you're good to go!</p>,
        placement: 'auto',
        placementBeacon: 'left',
      },
      {
        target: '#index-screen',
        title: <h3>Happy experimenting!</h3>,
        content: <p>That's pretty much it for the tour. You can always replay this tutorial via the 'Help' menu at the top.</p>,
        placement: 'center',
        disableBeacon: true,
        showProgress: false,
        disableOverlay: false, 
        locale: {last: 'Cool!'}
      },
    ],
  };

  names = {};

  tutorialCallback = (data) => {
    const { action, index, type } = data;
    const { setTutorialIndex } = this.props;
    if ([EVENTS.STEP_AFTER, EVENTS.CLOSE, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      setTutorialIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    }
    if (type === EVENTS.TOUR_END) {
      this.props.completeTutorial();
    }
  };

  componentDidMount() {
    const { state } = this.props;
    if ( state ) {
      this.setState({
        ...state,
      });
    }

    ipcRenderer.on('open-video', (event, arg) => {
      this.setState({
        file: {
          path: arg.path,
          size: arg.size,
        }
      })
    })
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handlePairedSliderChange = (name, min, max) => (event, value) => {
    this.setState({ [name]: value });
    if (!this.names[name]) {
      this.names[name] = `lastValid${name.charAt(0).toUpperCase() +
        name.slice(1)}`;
    }
    this.setState({
      [this.names[name]]: value
    });
  };

  handleSliderChange = (name) => (event, value) => {
    let names = name.split('.');
    if(names.length === 1) {
      this.setState({ [names[0]]: value });
    } else if(names.length === 2) {
      this.setState({
        [names[0]]: {
          ...this.state[names[0]],
          [names[1]]: value
        }
      })
    }
  };

  handleNumberInputChange = (name, min, max) => event => {
    this.setState({ [name]: event.target.value });
    if (!isNaN(parseFloat(event.target.value))) {
      var val = parseFloat(event.target.value);
      if (val >= min && val <= max || min === null || max === null) {
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
    let tempROI = Object.assign({}, this.state.tempROI);
    tempROI[position][component] = event.target.value;
    this.setState({ tempROI });
    if(!isNaN(parseFloat(event.target.value))){
      let roi = Object.assign({}, this.state.roi);
      roi[position][component] = parseFloat(event.target.value);
      this.setState({ roi });
    }
  };

  handleFileChange = event => {
    if(event.target.files[0] && event.target.files[0].type === 'video/mp4') {
      this.setState({
        file: event.target.files[0]
      });
    }
  };

  handleFileDrop = (acceptedFiles, rejectedFiles) => {
    // console.log(acceptedFiles[0]);
    if(acceptedFiles[0]) {
      this.setState({
        file: acceptedFiles[0],
      });
    }
  };

  handleMetaData = event => {
    if(this.state.meta && (
      this.state.meta.duration === event.target.duration ||
      this.state.meta.res.width === event.target.videoWidth ||
      this.state.meta.res.height === event.target.videoHeight
    )) return;
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
      },
      tempROI: {
        topLeft: {x: 0, y: 0},
        topRight: {x: event.target.videoWidth, y: 0},
        bottomLeft: {x: 0, y: event.target.videoHeight},
        bottomRight: {x: event.target.videoWidth, y: event.target.videoHeight},
      }
    })
  }

  resetLanes = () => {
    this.setState({
      lanes: {
        ...this.state.lanes,
        count: 5,
        shoulderSize: 0,
        perspectiveScaling: 1
      }
    })
  }

  render() {
    const { handleSubmit, handleSave } = this.props;
    const { runTutorial, tutorialIndex } = this.props;
    const { steps } = this.state;
    return (
      <Grid container direction="column" id="index-screen" alignItems="stretch" style={{
        height: '100vh'
      }}>
        <Joyride
          continuous
          steps={steps}
          run={runTutorial}
          showProgress
          showSkipButton
          callback={this.tutorialCallback}
          stepIndex={tutorialIndex}
          styles={joyrideStyles}
        />
        <Grid item key="1">
          <Topbar className="topbar" />
        </Grid>
        <Grid item key="2">
          <SplitPane split="vertical" minSize={500} maxSize={700} defaultSize={"50%"} style={{
            height: 'calc(100vh - 64px)',
          }}>
            <PerfectScrollbar option={{ suppressScrollX: true }}>
              <Settings
                state={this.state}
                handlePairedSliderChange={this.handlePairedSliderChange}
                handleSliderChange={this.handleSliderChange}
                handleNumberInputChange={this.handleNumberInputChange}
                handleChange={this.handleChange}
                handleROIChange={this.handleROIChange}
                handleFileChange={this.handleFileChange}
                validateValue={this.validateValue}
                resetLanes={this.resetLanes}
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
