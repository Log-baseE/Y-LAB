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

import { startDetect, cancelDetect } from "../linker";

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
    overflowY: "auto",
    flexGrow: 1,
    height: 0,
    margin: `${theme.spacing.unit * 2}px 0`
  },
  log: {
    margin: 0,
    fontFamily: "monospace",
    listStyle: "none",
    paddingLeft: 0
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
    status: "",
    frames: 1,
    cancelled: false,
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

  componentDidUpdate() {
    this.scrollToLogEnd();
  }

  scrollToLogEnd() {
    this.logEnd.scrollIntoView();
  }

  renderLog() {
    return this.state.logs.map((log, index) => <li key={index}>{log}</li>);
  }

  startDetection = () => {
    const { options } = this.props;
    startDetect(options, this.handleMessage, this.handleFinish);
  };

  handleMessage = message => {
    if (message === "PROGRAM_START") {
      this.setState({
        status: "Program started",
        progress: 1
      });
    } else if (message === "LIB_START") {
      this.setState({
        status: "Importing libraries..."
      });
    } else if (message === "LIB_END") {
      this.setState({
        status: "Libraries imported",
        progress: 5
      });
    } else if (message === "TF_START") {
      this.setState({
        status: "Importing tensorflow..."
      });
    } else if (message === "TF_END") {
      this.setState({
        status: "Tensorflow imported",
        progress: 15
      });
    } else if (message === "MODEL_START") {
      this.setState({
        status: "Building neural network..."
      });
    } else if (message === "MODEL_END") {
      this.setState({
        status: "Neural network built",
        progress: 30
      });
    } else if (message === "DETECT_START") {
      this.setState({
        status: "Starting object detection..."
      });
    } else if (/^FRAMES:(\d+)$/.test(message)) {
      let frames = parseInt(/^FRAMES:(\d+)$/.exec(message)[1]);
      this.setState({
        frames: frames
      });
    } else if (/^FRAME_INDEX:(\d+)$/.test(message)) {
      let index = parseInt(/^FRAME_INDEX:(\d+)$/.exec(message)[1]) + 1;
      this.setState({
        progress: this.state.progress + (69 / this.state.frames),
        status: `Processing frame ${index} out of ${this.state.frames} frame(s)`,
      });
    } else if (message === 'DETECT_END') {
      this.setState({
        status: "Object detection finished"
      });
    } else if (message === 'PROGRAM_END') {
      this.setState({
        status: "Finished",
        progress: 100,
      });
    }
    this.appendLog(message);
  };

  handleFinish = (err, code, signal) => {
    console.log(err, code, signal);
  };

  handleCancel = event => {
    cancelDetect();
    this.setState({
      progress: 99.999,
      status: 'Cancelled',
      cancelled: true,
    });
    this.appendLog('CANCELLED');
  }

  render() {
    const { classes } = this.props;
    const { handlePrevious } = this.props;
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
            onScroll={this.handleLogScroll}
            ref={el => {
              this.logs = el;
            }}
          >
            <Grid item xs={12}>
              <Collapse in={this.state.logExpanded}>
                <ul className={classes.log}>
                  {this.renderLog()}
                  <div
                    style={{ float: "left", clear: "both" }}
                    ref={el => {
                      this.logEnd = el;
                    }}
                  />
                </ul>
              </Collapse>
            </Grid>
          </Grid>
          <Grid container alignItems="center">
            <Button color="default" className={classes.cancel} disabled={this.state.progress === 100 || this.state.cancelled} onClick={this.handleCancel}>
              Cancel
            </Button>
            {
              this.state.cancelled ? 
              <Button variant="contained" color="default" onClick={handlePrevious}>
                Go back
              </Button>
              :
              <Button variant="contained" color="primary" disabled={this.state.progress !== 100}>
                Continue
              </Button>
            }
            
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(ProgressScreen);
