import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import VideoDetails from './VideoDetails';
import ResultDetails from './ResultDetails';
import { Button, Grid } from "@material-ui/core";

const electron = window.require("electron");
const { remote } = electron;
const fs = remote.require("fs");
const path = remote.require("path");
const { dialog } = remote;

const styles = theme => ({
  action: {
    paddingRight: theme.spacing.unit * 2,
  },
  save: {
    marginLeft: "auto",
    marginRight: theme.spacing.unit
  },
  // submit: {
  //   marginRight: theme.spacing.unit
  // }
});

class Details extends Component {
  handleSave = event => {
    const { state } = this.props;
    dialog.showSaveDialog(
      remote.getCurrentWindow(),
      {
        defaultPath: "*/result.mp4",
        filters: [{ name: "MP4 video", extensions: ["mp4"] }]
      },
      function(fileName) {
        if (fileName === undefined) {
          console.log("save cancelled");
          return;
        }
        let src = state.file.path;
        fs.copyFile(src, fileName, err => {
          if (err) {
            alert(
              "An error occurred while creating the file. Please see logs for details"
            );
            console.log(err);
          }
          alert(`Video saved to ${fileName}`);
        })
      }
    );
  };

  render() {
    const { classes } = this.props;
    const { state } = this.props;
    const { handleRestart } = this.props;
    return ([
      <ResultDetails 
        state={state}
        key={'resultdetails'}
      />,
      <VideoDetails
        state={state}
        key={'videodetails'} 
      />,
      <Grid container className={classes.action}>
        <Button
          component="span"
          className={classes.save}
          color="default"
          onClick={this.handleSave}
          disabled={state.file === null}
        >
          Save video
        </Button>
        <Button
          variant="outlined"
          component="span"
          className={classes.submit}
          color="default"
          onClick={handleRestart}
          disabled={state.file === null}
        >
          Try again
        </Button>
      </Grid>
    ]);
  }
}

export default withStyles(styles)(Details);
