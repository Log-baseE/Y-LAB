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

class VideoDetails extends Component {
  render() {
    const { classes } = this.props;
    const { state } = this.props;

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h6" className={classes.heading}>
          VIDEO DETAILS
        </Typography>
        <FormGroup>
          <Grid container>
            <Grid item md={4} style={{ paddingTop: 7 }}>
              <FormLabel>Path</FormLabel>
            </Grid>
            <Grid item container md={8} alignItems="center">
              <Grid item>
                <Typography
                  component="small"
                  style={{
                    margin: "8px 0"
                  }}
                >
                  {state.file.path}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </FormGroup>
        <FormGroup>
          <Grid container>
            <Grid item md={4} style={{ paddingTop: 7 }}>
              <FormLabel>Size</FormLabel>
            </Grid>
            <Grid item container md={8} alignItems="center">
              <Grid item>
                <Typography
                  component="small"
                  style={{
                    margin: "8px 0"
                  }}
                >
                  {filesize(state.file.size)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </FormGroup>
        {state.meta
          ? [
              <FormGroup key="1">
                <Grid container>
                  <Grid item md={4} style={{ paddingTop: 7 }}>
                    <FormLabel>Duration</FormLabel>
                  </Grid>
                  <Grid item container md={8} alignItems="center">
                    <Grid item>
                      <Typography
                        component="small"
                        style={{
                          margin: "8px 0"
                        }}
                      >
                        {state.meta.duration.toFixed(2)} s
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </FormGroup>,
              <FormGroup key="2">
                <Grid container>
                  <Grid item md={4} style={{ paddingTop: 7 }}>
                    <FormLabel>Resolution</FormLabel>
                  </Grid>
                  <Grid item container md={8} alignItems="center">
                    <Grid item>
                      <Typography
                        component="small"
                        style={{
                          margin: "8px 0"
                        }}
                      >
                        {state.meta.res.width} x {state.meta.res.height}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </FormGroup>
            ]
          : ""}
      </Paper>
    );
  }
}

VideoDetails.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VideoDetails);
