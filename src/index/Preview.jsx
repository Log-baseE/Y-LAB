import React, { Component } from "react";
import { Button, Card, CardActions, CardMedia, IconButton, Typography, Grid, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import Dropzone from 'react-dropzone'

import { ReactComponent as UploadVideoIcon } from '../res/icon/svg/upload-video.svg';
import ROIOverlay from './ROIOverlay';

import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import StopIcon from '@material-ui/icons/Stop';
import RepeatIcon from '@material-ui/icons/Repeat';
import RepeatOneIcon from '@material-ui/icons/RepeatOne';
import PauseIcon from '@material-ui/icons/Pause';
import { Slider } from "@material-ui/lab";

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 2,
    textAlign: 'center',
  },
  mediaFrame: {
    width: '100%',
    position: 'relative'
  },
  dropzone: {
    width: `calc(100% - ${theme.spacing.unit * 4}px)`,
    margin: theme.spacing.unit * 2,
    height: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'dashed 1px',
    borderColor: theme.palette.primary.light,
    cursor: 'pointer',
  },
  roiOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    minHeight: 50,
  },
  roiPolygon: {
    fill: 'rgba(255,255,255,.25)',
    stroke: 'yellow',
    strokeWidth: 2,
  },
  countingLine: {
    stroke: '#00ff00',
    strokeWidth: 2,
  },
  uploadIcon: {
    marginBottom: theme.spacing.unit * 2,
  },
  videoControls: {
    justifyContent: 'center'
  },
  save: {
    marginLeft: "auto",
    marginRight: theme.spacing.unit
  },
  tooltip: {
    transform: 'translateX(100%)',
  },
  action: {
    paddingRight: theme.spacing.unit * 2,
  }
});

class Preview extends Component {
  state = {
    play: false,
    duration: 1,
    currentTime: 0,
    repeat: false,
    confirmOpen: false,
  }

  handleToggleRepeat = event => {
    this.setState({
      repeat: !this.state.repeat,
    });
  }

  handlePlayPause = event => {
    let video = document.getElementById('video');
    this.setState({
      duration: video.duration,
    });
    if(this.state.play) {
      video.pause();
    } else {
      video.play();
    }
    this.setState({
      play: !this.state.play,
    });
  }

  handleSeekbar = event => {
    let video = document.getElementById('video');
    this.setState({
      duration: video.duration,
      currentTime: video.currentTime
    })
  }

  handleEnded = event => {
    let video = document.getElementById('video');
    this.setState({
      duration: video.duration,
      currentTime: 0,
    })
    video.pause();
    video.currentTime = 0;
    if(this.state.repeat) video.play();
    else this.setState({ play: false });
  }

  handleSkipPrevious = event => {
    let video = document.getElementById('video');
    this.setState({
      duration: video.duration,
      currentTime: 0,
      play: false,
    })
    video.pause();
    video.currentTime = 0;
  }

  handleSkipNext = event => {
    let video = document.getElementById('video');
    this.setState({
      duration: video.duration,
      currentTime: video.duration - 1e-9,
      play: false,
    })
    video.pause();
    video.currentTime = video.duration - 1e-9; 
  }

  handleConfirmOpen = event => {
    this.setState({
      confirmOpen: true,
    })
  }

  handleConfirmClose = event => {
    this.setState({
      confirmOpen: false,
    })
  }

  render() {
    const { classes } = this.props;
    const { state } = this.props;
    const { handleFileDrop, handleMetaData, handleSubmit, handleSave } = this.props;

    return ([
      <Card className={classes.root} key="preview-card" id="preview-card">
        {
          state.file ?
          <div className={classes.mediaFrame}>
            <CardMedia
              id="video"
              src={'file://' + state.file.path}
              component="video"
              onTimeUpdate={this.handleSeekbar}
              onEnded={this.handleEnded}
              onLoadedMetadata={handleMetaData}
             />
            {
              state.meta && state.roiType === "custom" ? 
              <ROIOverlay 
                viewBox={state.meta.res}
                vertical={state.direction === "vertical"}
                roi={state.roi}
                traffic={state.type === "traffic"}
                drawLanes={state.algorithm === "andrew"}
                lanes={state.lanes}
              />
              : ''
            }
          </div>
          :
          <Dropzone accept="video/mp4" onDrop={handleFileDrop} className={classes.dropzone}>
            <UploadVideoIcon className={classes.uploadIcon}/>
            <Typography variant="h6" color="textSecondary">
              Drop a video here or click
            </Typography>
            <Typography variant="body2" style={{ fontWeight: 'normal' }} color="textSecondary">
              Allowed files: *.mp4
            </Typography>
          </Dropzone>
        }
        <Slider 
          id="seek-bar"
          min={0}
          max={1}
          step={0.01}
          value={this.state.currentTime / this.state.duration}
          onChange={ (event, value) => {
            let video = document.getElementById('video');
            this.setState({
              currentTime: this.state.duration * value
            });
            video.currentTime = this.state.currentTime;
          }}
          disabled={state.file === null}
        />
        <CardActions className={classes.videoControls}>
          <Tooltip title="Previous" placement="bottom">
            <div>
              <IconButton aria-label="Previous" onClick={this.handleSkipPrevious} disabled={state.file === null}>
                <SkipPreviousIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip title="Toggle repeat" placement="bottom">
            <div>
              <IconButton aria-label="Toggle repeat" onClick={this.handleToggleRepeat} disabled={state.file === null}>
                {
                  this.state.repeat ?
                  <RepeatOneIcon /> :
                  <RepeatIcon />
                }
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip title={this.state.play ? "Pause" : "Play"} placement="bottom">
            <div>
              <IconButton aria-label="Play/pause" onClick={this.handlePlayPause} disabled={state.file === null}>
                {
                  this.state.play ?
                  <PauseIcon /> :
                  <PlayArrowIcon />
                }
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip title="Stop" placement="bottom">
            <div>
              <IconButton aria-label="Stop" onClick={this.handleSkipPrevious} disabled={state.file === null}>
                <StopIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip title="Next" placement="bottom">
            <div>
              <IconButton aria-label="Next" onClick={this.handleSkipNext} disabled={state.file === null}>
                <SkipNextIcon />
              </IconButton>
            </div>
          </Tooltip>
        </CardActions>
      </Card>,
      <Grid container className={classes.action} key="action">
        <Dialog
          open={this.state.confirmOpen}
          onClose={this.handleConfirmClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Process video?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Process the video with the chosen settings. If you wish
              to change something, you can press cancel at anytime.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleConfirmClose} color="default">
              Cancel
            </Button>
            <Button onClick={handleSubmit(state)} color="default" variant="outlined" autoFocus>
              Go!
            </Button>
          </DialogActions>
        </Dialog>
        <Button
          component="span"
          className={classes.save}
          color="default"
          onClick={handleSave(state)}
          disabled={state.file === null}
        >
          Save options
        </Button>
        <Button
          variant="contained"
          component="span"
          className={classes.submit}
          color="primary"
          onClick={this.handleConfirmOpen}
          disabled={state.file === null}
          id="submit-button"
        >
          LOOKS GOOD!
        </Button>
      </Grid>
    ]);
  }
}

export default withStyles(styles)(Preview);
