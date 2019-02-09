import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import SplitPane from "react-split-pane";
import Preview from "./Preview";
import Topbar from "./Topbar";
import Details from "./Details";

const electron = window.require("electron");
const { remote } = electron;
const fs = remote.require("fs");

class ResultScreen extends Component {
  state = {};

  componentWillMount() {
    const { result, options } = this.props;
    if (result && options) {
      this.loadState(result, options);
      this.forceUpdate();
    }
  }

  loadState = (result, options) => {
    this.setState({
      result: result,
    });
    this.setState(prevState => ({
      result: {
        ...prevState.result,
        file: {
          ...prevState.result.file,
          size: fs.statSync(result.file.path).size
        }
      }
    }));
    this.setState({
      options: {
        source: options.file.path,
        type: options.type,
        model: options.nnModel,
        weights: options.weights,
        gpu: options.lastValidGpu,
        algorithm: options.algorithm,
        roi: options.roi,
        lanes: options.lanes.count,
        pixelThreshold: options.lastValidPixelThreshold,
        timeThreshold: options.lastValidTimeThreshold,
        direction: options.direction,
        confidenceThreshold: options.lastValidThreshold
      },
    });
  };

  handleMetaData = event => {
    let duration = event.target.duration;
    let width = event.target.videoWidth;
    let height = event.target.videoHeight;
    this.setState(prevState => ({
      result: {
        ...prevState.result,
        meta: {
          duration: duration,
          res: {
            width: width,
            height: height 
          }
        }
      }
    }));
  };

  render() {
    const { handleRestart } = this.props;
    return (
      <Grid
        container
        direction="column"
        alignItems="stretch"
        style={{
          height: "100vh"
        }}
      >
        <Grid item>
          <Topbar />
        </Grid>
        <Grid item>
          <SplitPane
            split="vertical"
            minSize={500}
            maxSize={700}
            defaultSize={"50%"}
            style={{
              height: "calc(100vh - 64px)"
            }}
          >
            <PerfectScrollbar option={{ suppressScrollX: true }}>
              <Preview
                result={this.state.result}
                handleMetaData={this.handleMetaData}
                rand={Math.random()}
              />
            </PerfectScrollbar>
            <PerfectScrollbar option={{ suppressScrollX: true }}>
              <Details state={this.state} handleRestart={handleRestart} />
            </PerfectScrollbar>
          </SplitPane>
        </Grid>
      </Grid>
    );
  }
}

export default ResultScreen;
