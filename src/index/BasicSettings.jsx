import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Grid, FormGroup, FormLabel, RadioGroup, FormControlLabel, Button, Typography, Table, TableBody, TableRow, TableCell, Paper } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import CustomRadio from '../custom/CustomRadio';

const styles = theme => ({
  input: {
    display: 'none',
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
  },
  heading: {
    marginBottom: theme.spacing.unit
  }
});

class BasicSettings extends Component {
  render() {
    const { classes } = this.props;
    const { state } = this.props;
    const { handleChange } = this.props;

    return (
      <Paper className={ classes.root } elevation={1}>
        <Typography variant="h6" className={ classes.heading }>
          SETTINGS
        </Typography>
        <FormGroup>
          <Grid container alignItems="center">
            <Grid item md={4}>
              <FormLabel>File path</FormLabel>
            </Grid>
            <Grid item container md={8} alignItems="center" spacing={16}>
              <Grid item>
                <input 
                  accept="*"
                  className={classes.input}
                  id="file-input"
                  type="file"
                />
                <label htmlFor="file-input">
                  <Button variant="contained" component="span" size="small">
                    Browse
                  </Button>
                </label>
              </Grid>
              <Grid item>
                <Typography component="small">Browse a file or click on the preview window</Typography>
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
                <FormControlLabel value="default" control={<CustomRadio />} label="Default" />
                <FormControlLabel value="traffic" control={<CustomRadio />} label="Traffic" />
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
              { this.props.state.fileDetails ? 
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                : <Typography component="small">Details will appear when you choose a file</Typography>
              }
            </Grid>
          </Grid>
        </FormGroup>
      </Paper>
    );
  }
}

BasicSettings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BasicSettings);
