import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
} from "@material-ui/core";

const styles = theme => ({
  root: {
    background: '#202021',
    height: theme.spacing.unit * 8,
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
    alignItems: 'center',
  },
  heading: {
    color: 'white',
    // fontWeight: 'bold',
    lineHeight: 1,
  }
});

class Topbar extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.root}>
        <Typography variant="h5" className={classes.heading}><strong>Y-LAB</strong>&nbsp;&nbsp;&gt;&nbsp;&nbsp;VIDEO OBJECT DETECTION</Typography>
      </Grid>
    );
  }
}

export default withStyles(styles)(Topbar);
