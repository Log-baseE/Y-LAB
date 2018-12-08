import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  FormGroup,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Button,
  Typography,
  Paper
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CustomRadio from "../custom/CustomRadio";
import filesize from "filesize";

const styles = theme => ({
  input: {
    display: "none"
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2
  },
  heading: {
    marginBottom: theme.spacing.unit
  }
});

class BasicSettings extends Component {
  render() {
    const { classes } = this.props;
    const { state } = this.props;
    const { handleChange, handleFileChange } = this.props;

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h6" className={classes.heading}>
          SETTINGS
        </Typography>
        <FormGroup>
          <Grid container>
            <Grid item md={4} style={{ paddingTop: 7 }}>
              <FormLabel>File path</FormLabel>
            </Grid>
            <Grid item container md={8} alignItems="center">
              <Grid item>
                <input
                  accept="video/mp4"
                  className={classes.input}
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-input">
                  <Button
                    variant="outlined"
                    component="span"
                    size="small"
                    color="default"
                    style={{
                      marginRight: 16
                    }}
                  >
                    Browse
                  </Button>
                </label>
              </Grid>
              <Grid item>
                <Typography
                  component="small"
                  style={{
                    margin: "8px 0"
                  }}
                >
                  {state.file
                    ? state.file.path
                    : "Browse a file or click on the preview window"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </FormGroup>
        <FormGroup>
          <Grid container alignItems="center">
            <Grid item md={4}>
              <FormLabel>Object detection type</FormLabel>
            </Grid>
            <Grid item md={8}>
              <RadioGroup
                aria-label="object detection type"
                name="type"
                value={this.props.state.type}
                onChange={handleChange}
                row
              >
                <FormControlLabel
                  value="default"
                  control={<CustomRadio />}
                  label="Default"
                />
                <FormControlLabel
                  value="traffic"
                  control={<CustomRadio />}
                  label="Traffic (feature in construction)"
                  disabled
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </FormGroup>
        <FormGroup>
          <Grid container>
            <Grid item md={4} style={{ padding: "7px 0" }}>
              <FormLabel>File details</FormLabel>
            </Grid>
            <Grid item md={8} style={{ padding: "7px 0" }}>
              {state.file ? (
                [
                  <Grid item container xs={12} key='type'>
                    <Grid item xs={4}>
                      <Typography variant="body2">Type</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{state.file.type}</Typography>
                    </Grid>
                  </Grid>,
                  <Grid item container xs={12} key='size'>
                    <Grid item xs={4}>
                      <Typography variant="body2">Size</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {filesize(state.file.size)}
                      </Typography>
                    </Grid>
                  </Grid>,
                  state.meta
                    ? [
                        <Grid item container xs={12} key='res'>
                          <Grid item xs={4}>
                            <Typography variant="body2">Resolution</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="body2">
                              {state.meta.res.width} x {state.meta.res.height}
                            </Typography>
                          </Grid>
                        </Grid>,
                        <Grid item container xs={12} key='duration'>
                          <Grid item xs={4}>
                            <Typography variant="body2">Duration</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="body2">
                              {state.meta.duration.toFixed(2)} s
                            </Typography>
                          </Grid>
                        </Grid>
                      ]
                    : ""
                ]
              ) : (
                <Typography component="small">
                  Details will appear when you choose a file
                </Typography>
              )}
            </Grid>
          </Grid>
        </FormGroup>
      </Paper>
    );
  }
}

BasicSettings.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BasicSettings);
