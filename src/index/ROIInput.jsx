import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  Typography,
  Paper,
  ButtonBase,
  FormControl,
  Grid,
  TextField
} from "@material-ui/core";
import classNames from "classnames";

const styles = theme => ({
  card: {
    width: "100%",
    height: 200,
    position: "relative",
    marginBottom: theme.spacing.unit * 4,
  },
  background: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: "100%",
    width: "100%",
    padding: theme.spacing.unit * 2
  },
  coordinate: {
    position: "absolute",
    padding: theme.spacing.unit
  },
  top: {
    top: 0
  },
  right: {
    right: 0
  },
  bottom: {
    bottom: 0
  },
  left: {
    left: 0
  },
  coordinateInput: {
    maxWidth: 32,
    padding: theme.spacing.unit,
    textAlign: 'center',
  },
  border: {
    position: "absolute",
    height: "calc(100% - 32px)",
    width: "calc(100% - 32px)",
    border: "solid 1px rgba(0,0,0,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

class ROIInput extends Component {
  render() {
    const { classes } = this.props;
    const { roi, handleROIChange } = this.props;
    return (
      <Paper className={classes.card} elevation={1}>
        <ButtonBase focusRipple className={classes.background}>
          <div className={classes.border}>
            <Typography variant="body2">
              Edit any of the x,y input fields to move the corresponding corner of the desired region of interest (ROI). You can preview the ROI directly on the video preview
            </Typography>
          </div>
        </ButtonBase>
        <Paper
          elevation={0}
          className={classNames(classes.coordinate, classes.top, classes.left)}
        >
          <Grid container alignItems="flex-end">
            <Grid item>
              <FormControl>
                <TextField
                  error={!/^-?\d+(\.\d+)?$/.test(roi.topLeft.x)}
                  label="x"
                  variant="outlined"
                  inputProps={{
                    className: classes.coordinateInput
                  }}
                  InputLabelProps={{ shrink: true }}
                  value={roi.topLeft.x}
                  onChange={handleROIChange('topLeft', 'x')}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <Typography variant="h6">&nbsp;,&nbsp;&nbsp;</Typography>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  error={!/^-?\d+(\.\d+)?$/.test(roi.topLeft.y)}
                  variant="outlined"
                  label="y"
                  inputProps={{
                    className: classes.coordinateInput
                  }}
                  InputLabelProps={{ shrink: true }}
                  value={roi.topLeft.y}
                  onChange={handleROIChange('topLeft', 'y')}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <Paper
          elevation={0}
          className={classNames(classes.coordinate, classes.top, classes.right)}
        >
          <Grid container alignItems="flex-end">
            <Grid item>
              <FormControl>
                <TextField
                  error={!/^-?\d+(\.\d+)?$/.test(roi.topRight.x)}
                  variant="outlined"
                  label="x"
                  inputProps={{
                    className: classes.coordinateInput
                  }}
                  InputLabelProps={{ shrink: true }}
                  value={roi.topRight.x}
                  onChange={handleROIChange('topRight', 'x')}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <Typography variant="h6">&nbsp;,&nbsp;&nbsp;</Typography>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  error={!/^-?\d+(\.\d+)?$/.test(roi.topRight.y)}
                  variant="outlined"
                  label="y"
                  inputProps={{
                    className: classes.coordinateInput
                  }}
                  InputLabelProps={{ shrink: true }}
                  value={roi.topRight.y}
                  onChange={handleROIChange('topRight', 'y')}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <Paper
          elevation={0}
          className={classNames(
            classes.coordinate,
            classes.bottom,
            classes.left
          )}
        >
          <Grid container alignItems="flex-end">
            <Grid item>
              <FormControl>
                <TextField
                  error={!/^-?\d+(\.\d+)?$/.test(roi.bottomLeft.x)}
                  variant="outlined"
                  label="x"
                  inputProps={{
                    className: classes.coordinateInput
                  }}
                  InputLabelProps={{ shrink: true }}
                  value={roi.bottomLeft.x}
                  onChange={handleROIChange('bottomLeft', 'x')}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <Typography variant="h6">&nbsp;,&nbsp;&nbsp;</Typography>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  error={!/^-?\d+(\.\d+)?$/.test(roi.bottomLeft.y)}
                  variant="outlined"
                  label="y"
                  inputProps={{
                    className: classes.coordinateInput
                  }}
                  InputLabelProps={{ shrink: true }}
                  value={roi.bottomLeft.y}
                  onChange={handleROIChange('bottomLeft', 'y')}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <Paper
          elevation={0}
          className={classNames(
            classes.coordinate,
            classes.bottom,
            classes.right
          )}
        >
          <Grid container alignItems="flex-end">
            <Grid item>
              <FormControl>
                <TextField
                  error={!/^-?\d+(\.\d+)?$/.test(roi.bottomRight.x)}
                  variant="outlined"
                  label="x"
                  inputProps={{
                    className: classes.coordinateInput
                  }}
                  InputLabelProps={{ shrink: true }}
                  value={roi.bottomRight.x}
                  onChange={handleROIChange('bottomRight', 'x')}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <Typography variant="h6">&nbsp;,&nbsp;&nbsp;</Typography>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  error={!/^-?\d+(\.\d+)?$/.test(roi.bottomRight.y)}
                  variant="outlined"
                  label="y"
                  inputProps={{
                    className: classes.coordinateInput
                  }}
                  InputLabelProps={{ shrink: true }}
                  value={roi.bottomRight.y}
                  onChange={handleROIChange('bottomRight', 'y')}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Paper>
    );
  }
}

ROIInput.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ROIInput);
