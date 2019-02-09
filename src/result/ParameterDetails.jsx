import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  FormGroup,
  FormLabel,
  Typography,
  Paper
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

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

class ParameterDetails extends Component {
  render() {
    const { classes } = this.props;
    const { options } = this.props;

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h6" className={classes.heading}>
          DETECTION PARAMETERS
        </Typography>
        <FormGroup>
          <Grid container>
            <Grid item md={4} style={{ paddingTop: 7 }}>
              <FormLabel>Detection type</FormLabel>
            </Grid>
            <Grid item container md={8} alignItems="center">
              <Grid item>
                <Typography component="small" style={{ margin: "8px 0", textTransform: 'capitalize' }}>
                  {options.type}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </FormGroup>
        <FormGroup>
          <Grid container>
            <Grid item md={4} style={{ paddingTop: 7 }}>
              <FormLabel>Source video</FormLabel>
            </Grid>
            <Grid item container md={8} alignItems="center">
              <Grid item>
                <Typography component="small" style={{ margin: "8px 0" }}>
                  {options.source}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </FormGroup>
        <FormGroup>
          <Grid container>
            <Grid item md={4} style={{ paddingTop: 7 }}>
              <FormLabel>Region of interest</FormLabel>
            </Grid>
            <Grid item container md={8} alignItems="center">
              <Grid item>
                <Typography component="small" style={{ margin: "8px 0" }}>
                  ({options.roi.topLeft.x}, {options.roi.topLeft.y}),
                  ({options.roi.topRight.x}, {options.roi.topRight.y}),
                  ({options.roi.bottomRight.x}, {options.roi.bottomRight.y}),
                  ({options.roi.bottomLeft.x}, {options.roi.bottomLeft.y})
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </FormGroup>
        {
          options.type === 'traffic' ?
          <FormGroup>
            <Grid container>
              <Grid item md={4} style={{ paddingTop: 7 }}>
                <FormLabel>Traffic flow direction</FormLabel>
              </Grid>
              <Grid item container md={8} alignItems="center">
                <Grid item>
                  <Typography component="small" style={{ margin: "8px 0" }}>
                    {options.direction}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </FormGroup> : ''
        }
        {
          options.type === 'traffic' && options.algorithm === 'andrew' ?
          <FormGroup>
            <Grid container>
              <Grid item md={4} style={{ paddingTop: 7 }}>
                <FormLabel>Lanes</FormLabel>
              </Grid>
              <Grid item container md={8} alignItems="center">
                <Grid item>
                  <Typography component="small" style={{ margin: "8px 0" }}>
                    {options.lanes}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </FormGroup> : ''
        }
        {
          options.type === 'traffic' ?
          <FormGroup>
            <Grid container>
              <Grid item md={4} style={{ paddingTop: 7 }}>
                <FormLabel>Algorithm</FormLabel>
              </Grid>
              <Grid item container md={8} alignItems="center">
                <Grid item>
                  <Typography component="small" style={{ margin: "8px 0", textTransform: 'capitalize' }}>
                    {options.algorithm}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </FormGroup> : ''
        }
        {
          options.type === 'traffic' ?
          <FormGroup>
            <Grid container>
              <Grid item md={4} style={{ paddingTop: 7 }}>
                <FormLabel>Pixel threshold</FormLabel>
              </Grid>
              <Grid item container md={8} alignItems="center">
                <Grid item>
                  <Typography component="small" style={{ margin: "8px 0" }}>
                    {options.pixelThreshold} px
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </FormGroup> : ''
        }
        {
          options.type === 'traffic' ?
          <FormGroup>
            <Grid container>
              <Grid item md={4} style={{ paddingTop: 7 }}>
                <FormLabel>Time threshold</FormLabel>
              </Grid>
              <Grid item container md={8} alignItems="center">
                <Grid item>
                  <Typography component="small" style={{ margin: "8px 0" }}>
                    {options.timeThreshold} frames
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </FormGroup> : ''
        }
        <FormGroup>
          <Grid container>
            <Grid item md={4} style={{ paddingTop: 7 }}>
              <FormLabel>Neural network model</FormLabel>
            </Grid>
            <Grid item container md={8} alignItems="center">
              <Grid item>
                <Typography component="small" style={{ margin: "8px 0" }}>
                  {options.model}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </FormGroup>
        <FormGroup>
          <Grid container>
            <Grid item md={4} style={{ paddingTop: 7 }}>
              <FormLabel>Weights</FormLabel>
            </Grid>
            <Grid item container md={8} alignItems="center">
              <Grid item>
                <Typography component="small" style={{ margin: "8px 0" }}>
                  {options.weights}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </FormGroup>
        <FormGroup>
          <Grid container>
            <Grid item md={4} style={{ paddingTop: 7 }}>
              <FormLabel>GPU use</FormLabel>
            </Grid>
            <Grid item container md={8} alignItems="center">
              <Grid item>
                <Typography component="small" style={{ margin: "8px 0" }}>
                  {options.gpu} %
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </FormGroup>
      </Paper>
    );
  }
}

ParameterDetails.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ParameterDetails);
