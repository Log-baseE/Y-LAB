import React, { Component } from "react";
import { Card, CardActions, CardMedia, IconButton, Typography } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import Dropzone from 'react-dropzone'

import { ReactComponent as UploadVideoIcon } from '../res/icon/svg/upload-video.svg';

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
  },
  dropzone: {
    width: '100%',
    height: 400,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'dashed 1px rgba(0,0,0,.5)',
    cursor: 'pointer',
  },
  uploadIcon: {
    marginBottom: theme.spacing.unit * 2,
  },
  videoControls: {
    justifyContent: 'center'
  }
});

class Preview extends Component {
  state = {
    play: false,
    duration: 1,
    currentTime: 0,
    repeat: false,
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

  render() {
    const { classes } = this.props;
    const { state, handleFileDrop, handleMetaData } = this.props;
    return (
      <Card className={classes.root}>
        {
          state.file ?
          <CardMedia
            id="video"
            src={state.file.path}
            component="video"
            onTimeUpdate={this.handleSeekbar}
            onEnded={this.handleEnded}
            onLoadedMetadata={handleMetaData}
          /> :
          <Dropzone onDrop={handleFileDrop} className={classes.dropzone}>
            <UploadVideoIcon className={classes.uploadIcon}/>
            <Typography variant="h6" color="textSecondary">
              Drop your video here
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
          <IconButton aria-label="Previous" onClick={this.handleSkipPrevious}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton aria-label="Toggl repeat" onClick={this.handleToggleRepeat}>
            {
              this.state.repeat ?
              <RepeatOneIcon /> :
              <RepeatIcon />
            }
          </IconButton>
          <IconButton aria-label="Play/pause" onClick={this.handlePlayPause}>
            {
              this.state.play ?
              <PauseIcon /> :
              <PlayArrowIcon />
            }
          </IconButton>
          <IconButton aria-label="Stop" onClick={this.handleSkipPrevious}>
            <StopIcon />
          </IconButton>
          <IconButton aria-label="Next" onClick={this.handleSkipNext}>
            <SkipNextIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(Preview);
