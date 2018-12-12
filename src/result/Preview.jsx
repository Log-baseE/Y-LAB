import React, { Component } from "react";
import { Card, CardActions, CardMedia, IconButton, Tooltip } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

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
    const { state } = this.props;
    const { handleMetaData } = this.props;

    return ([
      <Card className={classes.root} key="preview-card">
        <CardMedia
          id="video"
          src={state.file.path}
          component="video"
          onTimeUpdate={this.handleSeekbar}
          onEnded={this.handleEnded}
          onLoadedMetadata={handleMetaData}
        />
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
            <IconButton aria-label="Previous" onClick={this.handleSkipPrevious} disabled={state.file === null}>
              <SkipPreviousIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle repeat" placement="bottom">
            <IconButton aria-label="Toggle repeat" onClick={this.handleToggleRepeat} disabled={state.file === null}>
              {
                this.state.repeat ?
                <RepeatOneIcon /> :
                <RepeatIcon />
              }
            </IconButton>
          </Tooltip>
          <Tooltip title={this.state.play ? "Pause" : "Play"} placement="bottom">
            <IconButton aria-label="Play/pause" onClick={this.handlePlayPause} disabled={state.file === null}>
              {
                this.state.play ?
                <PauseIcon /> :
                <PlayArrowIcon />
              }
            </IconButton>
          </Tooltip>
          <Tooltip title="Stop" placement="bottom">
            <IconButton aria-label="Stop" onClick={this.handleSkipPrevious} disabled={state.file === null}>
              <StopIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Next" placement="bottom">
            <IconButton aria-label="Next" onClick={this.handleSkipNext} disabled={state.file === null}>
              <SkipNextIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    ]);
  }
}

export default withStyles(styles)(Preview);
