import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import VideoDetails from './VideoDetails';
import ResultDetails from './ResultDetails';
import { Button, Grid } from "@material-ui/core";

const styles = theme => ({
  action: {
    paddingRight: theme.spacing.unit * 2,
  },
  save: {
    marginLeft: "auto",
    marginRight: theme.spacing.unit
  },
});

class Details extends Component {
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
          // onClick={handleSave(state)}
          disabled={state.file === null}
        >
          Save results
        </Button>
        <Button
          variant="outlined"
          component="span"
          className={classes.submit}
          color="primary"
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
