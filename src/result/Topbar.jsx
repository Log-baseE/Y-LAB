import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
} from "@material-ui/core";

const styles = theme => ({
  root: {
    background: theme.palette.primary.main,
    height: theme.spacing.unit * 8,
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
    alignItems: 'center',
  },
  heading: {
    color: 'white',
    fontWeight: 'bold',
    lineHeight: 1,
  }
});

class Topbar extends Component {
  state = {
    progress: 0,
    logs: [],
    logExpanded: false,
    status: "",
    frames: 1,
    cancelled: false,
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.root}>
        <Typography variant="h5" className={classes.heading}>RESULTS</Typography>
      </Grid>
    );
  }
}

export default withStyles(styles)(Topbar);
