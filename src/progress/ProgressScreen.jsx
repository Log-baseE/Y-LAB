import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Paper,
  LinearProgress,
  Button,
  Collapse
} from "@material-ui/core";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";

import { startDetect, cancelDetect } from "../linker";

const electron = window.require("electron");
const { remote } = electron;
const { ipcRenderer } = electron;
const currentWindow = remote.getCurrentWindow();
const path = remote.require("path");

const styles = theme => ({
  root: {
    width: "100vw",
    height: "100vh",
    padding: theme.spacing.unit * 2
  },
  card: {
    width: "80%",
    height: `100%`,
    display: "flex",
    margin: "0 auto",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.unit * 4
  },
  progress: {
    padding: `${theme.spacing.unit * 2}px 0`
  },
  cancel: {
    marginLeft: "auto",
    marginRight: theme.spacing.unit
  },
  logContainer: {
    overflow: "hidden",
    position: "relative",
    flexGrow: 1,
    height: 0,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit
  },
  log: {
    margin: 0,
    fontFamily: "monospace",
    listStyle: "none",
    paddingLeft: 0,
    paddingBottom: theme.spacing.unit,
    color: theme.palette.text.primary
  },
  link: {
    cursor: "pointer",
    textDecoration: "underline"
  }
});

class ProgressScreen extends Component {
  state = {
    progress: 0,
    logs: [],
    logExpanded: false,
    status: "Starting object detection engine...",
    frames: 1,
    cancelled: false
  };

  componentDidMount() {
    const { options } = this.props;
    if (options) {
    this.startDetection();
    }
  }

  appendLog = log => {
    this.setState(prevState => ({
      logs: [...prevState.logs, log]
    }));
  };

  appendError = err => {
    this.setState(prev => ({
      logs: [...prev.logs, <span style={{ color: "red" }}>{`${err}`}</span>],
      cancelled: true,
      progress: 99.999,
      status: (
        <span style={{ color: "red" }}>Program error! See log for details</span>
      )
    }));
  };

  componentDidUpdate() {
    this.scrollToLogEnd();
  }

  scrollToLogEnd() {
    this.logEnd.scrollIntoView();
  }

  renderLog() {
    return this.state.logs.map((log, index) => (
      <li key={index}>
        <pre style={{ margin: 0 }}>{log}</pre>
      </li>
    ));
  }

  setProgress = (val) => {
    this.setState({
      progress: val
    });
    currentWindow.setProgressBar(val/100);
  }

  startDetection = () => {
    const { options } = this.props;
    // for (let i = 0; i < 100; ++i) {
    //   this.appendLog(
    //     "ASDJFNALSKDJFNALSDKJNFALSDKJNFALSDKJNFALSKJDNFLASKDJNFLASKDJNFLAKSJDNFLASKJDNFLAKSJDNFLAKSJDNFLKASJDNFLASKJDNFALKSJDNFLASKDJNFALSKDJFN"
    //   );
    // }
    currentWindow.setProgressBar(2);
    this.appendLog(this.state.status);
    startDetect(options, this.handleMessage, this.handleFinish);
  };

  handleMessage = message => {
    if (message === "PROGRAM_START") {
      this.setState({
        status: "Program started",
      });
      this.setProgress(1);
      this.appendLog("Program started");
    } else if (message === "LIB_START") {
      this.setState({
        status: "Importing libraries..."
      });
      this.appendLog("Importing libraries...");
    } else if (message === "LIB_END") {
      this.setState({
        status: "Libraries imported",
      });
      this.setProgress(5);
      this.appendLog("Libraries imported");
    } else if (message === "TF_START") {
      this.setState({
        status: "Importing tensorflow..."
      });
      this.appendLog("Importing tensorflow...");
    } else if (message === "TF_END") {
      this.setState({
        status: "Tensorflow imported",
      });
      this.setProgress(15);
      this.appendLog("Tensorflow imported");
    } else if (message === "MODEL_START") {
      this.setState({
        status: "Building neural network..."
      });
      this.appendLog("Building neural network...");
    } else if (message === "MODEL_END") {
      this.setState({
        status: "Neural network built",
      });
      this.setProgress(30);
      this.appendLog("Neural network built");
    } else if (message === "DETECT_START") {
      this.setState({
        status: "Starting object detection..."
      });
      this.appendLog("Starting object detection...");
    } else if (/^FRAMES:(\d+)$/.test(message)) {
      let frames = parseInt(/^FRAMES:(\d+)$/.exec(message)[1]);
      this.setState({
        frames: frames
      });
    } else if (/^FRAME_INDEX:(\d+)$/.test(message)) {
      let index = parseInt(/^FRAME_INDEX:(\d+)$/.exec(message)[1]) + 1;
      this.setState({
        status: `Processing frame ${index} out of ${this.state.frames} frame(s)`
      });
      this.setProgress(this.state.progress + 69 / this.state.frames);
      this.appendLog(`Processing frame ${index} out of ${this.state.frames} frame(s)`);
    } else if (message === "DETECT_END") {
      this.setState({
        status: "Object detection finished"
      });
      this.appendLog("Object detection finished");
    } else if (message === "WRITE_START") {
      this.setState({
        status: "Rendering result video..."
      });
      this.appendLog("Rendering result video...");
    } else if (message === "WRITE_END") {
      this.setState({
        status: "Finished rendering video"
      });
      this.appendLog("Finished rendering video");
    } else if (message === "PROGRAM_END") {
      this.setState({
        status: "Finished",
      });
      this.setProgress(100);
      this.appendLog("Finished");
    } else {
      this.appendLog(message);
    }
  };

  handleFinish = (err, code, signal) => {
    if (err){
      this.appendError(err);
      currentWindow.setProgressBar(1, {
        mode: 'error',
      });
    }
    currentWindow.on('focus', () => {
      currentWindow.setProgressBar(-1);
      currentWindow.on('focus', () => {});
    });
    if (code) this.appendLog(`Program exited with code ${code}`);
    if (signal) this.appendLog(`Program exited with code ${code}`);
  };

  handleCancel = event => {
    cancelDetect();
    this.setState({
      progress: 99.999,
      status: "Cancelled",
      cancelled: true
    });
    this.appendLog("CANCELLED");
    if(!currentWindow.isFocused()) {
      currentWindow.setProgressBar(1, {
        mode: 'error',
      });
      setTimeout(() => {
        currentWindow.setProgressBar(-1);
      }, 1000);
    }
  };

  render() {
    const { classes } = this.props;
    const { handlePrevious, handleResult } = this.props;
    return (
      <div className={classes.root}>
        <Paper className={classes.card}>
          <Grid container alignItems="flex-start">
            <Grid item xs={12}>
              <Typography variant="h4">Processing...</Typography>
              <Typography variant="subtitle1">
                Please be very patient. This may take a long time...
              </Typography>
              <div className={classes.progress}>
                <LinearProgress
                  variant="determinate"
                  value={this.state.progress}
                  onChange={() => ipcRenderer.send('progress', this.state.progress/100)}
                />
              </div>
              <Typography variant="body2" style={{ fontSize: 14 }}>
                {this.state.status}
              </Typography>
            </Grid>
          </Grid>
          <Grid container style={{ padding: "16px 0" }}>
            <Typography
              variant="body2"
              onClick={e =>
                this.setState({ logExpanded: !this.state.logExpanded })
              }
              className={classes.link}
            >
              {this.state.logExpanded ? "Hide log" : "Show log"}
            </Typography>
          </Grid>

          <Grid
            container
            alignItems="flex-start"
            className={classes.logContainer}
            ref={el => {
              this.logs = el;
            }}
            style={{
              border: this.state.logExpanded ? 'solid thin rgba(255,255,255,0.5)' : 'none'
            }}
          >
            <PerfectScrollbar>
              <Collapse in={this.state.logExpanded}>
                <Grid item xs={12}>
                  <ul className={classes.log}>
                    {this.renderLog()}
                    <div
                      style={{ float: "left", clear: "both" }}
                      ref={el => {
                        this.logEnd = el;
                      }}
                    />
                  </ul>
                </Grid>
              </Collapse>
            </PerfectScrollbar>
          </Grid>
          <Grid container alignItems="center">
            <Button
              color="default"
              className={classes.cancel}
              disabled={this.state.progress === 100 || this.state.cancelled}
              onClick={this.handleCancel}
            >
              Cancel
            </Button>
            {this.state.cancelled ? (
              <Button
                variant="contained"
                color="default"
                onClick={handlePrevious}
              >
                Go back
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleResult(
                  path.join(remote.app.getAppPath(), "./.ylab/data.json")
                )}
                disabled={this.state.progress !== 100}
              >
                Continue
              </Button>
            )}
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(ProgressScreen);
