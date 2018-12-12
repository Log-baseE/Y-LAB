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

class ResultDetails extends Component {
  render() {
    const { classes } = this.props;
    const { state } = this.props;

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h6" className={classes.heading}>
          RESULT
        </Typography>
        <FormGroup>
          <Grid container>
            <Grid item md={4} style={{ paddingTop: 7 }}>
              <FormLabel>Detection type</FormLabel>
            </Grid>
            <Grid item container md={8} alignItems="center">
              <Grid item>
                <Typography
                  component="small"
                  style={{
                    margin: "8px 0"
                  }}
                >
                  {state.type}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </FormGroup>
        <FormGroup>
          <Grid container>
            <Grid item md={4} style={{ paddingTop: 7 }}>
              <FormLabel>Detected objects</FormLabel>
            </Grid>
            <Grid item container md={8} alignItems="center">
              <Grid item>
                <Typography
                  component="small"
                  style={{
                    margin: "8px 0"
                  }}
                >
                  {state.objects.join(', ')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </FormGroup>
        {
          state.type === 'traffic' ? 
          <FormGroup>
            <Grid container>
              <Grid item md={4} style={{ paddingTop: 7 }}>
                <FormLabel>Car count</FormLabel>
              </Grid>
              <Grid item container md={8} alignItems="center">
                <Grid item>
                  <Typography
                    component="small"
                    style={{
                      margin: "8px 0"
                    }}
                  >
                    {state.car_count}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </FormGroup>
          :
          <FormGroup>
            <Grid container>
              <Grid item md={4} style={{ paddingTop: 7 }}>
                <FormLabel>Objects per frame</FormLabel>
              </Grid>
              <Grid item container md={8} alignItems="center">
                <Grid item>
                  <Typography
                    component="small"
                    style={{
                      margin: "8px 0"
                    }}
                  >
                    {state.count_per_frame}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </FormGroup>
        }
      </Paper>
    );
  }
}

ResultDetails.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ResultDetails);
