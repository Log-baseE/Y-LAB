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
    const { result } = this.props;
    if (result) {
      this.loadResult(result);
    }
  }

  loadResult = result => {
    this.setState(result);
    this.setState(prevState => ({
      file: {
        ...prevState.file,
        size: fs.statSync(result.file.path).size
      }
    }));
    this.forceUpdate();
  };

  handleMetaData = event => {
    this.setState({
      meta: {
        duration: event.target.duration,
        res: {
          width: event.target.videoWidth,
          height: event.target.videoHeight
        }
      },
      roi: {
        topLeft: { x: 0, y: 0 },
        topRight: { x: event.target.videoWidth, y: 0 },
        bottomLeft: { x: 0, y: event.target.videoHeight },
        bottomRight: { x: event.target.videoWidth, y: event.target.videoHeight }
      }
    });
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
                state={this.state}
                handleMetaData={this.handleMetaData}
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
