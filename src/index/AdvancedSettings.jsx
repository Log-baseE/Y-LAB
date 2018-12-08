import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  FormControl,
  FormLabel,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Grow,
  InputAdornment,
  Input,
  FormHelperText
} from "@material-ui/core";
import { Slider } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";
import CustomRadio from "../custom/CustomRadio";
import ROIInput from "./ROIInput";

const styles = theme => ({
  input: {
    display: "none"
  },
  root: {
    margin: theme.spacing.unit * 2,
    borderRadius: 4,
    '&:before': {
      height: 0,
    },
  },
  focused: {
    borderColor: 'red',
  },
  formControl: {
    width: "100%"
  },
  defaultRadio: {
    width: `${100 / 3}%`
  },
  slider: {
    padding: "12px 0",
    marginBottom: 24
  },
  numberInput: {
    maxWidth: 50
  }
});

class AdvancedSettings extends Component {
  render() {
    const { classes } = this.props;
    const { state } = this.props;
    const { handleChange, handleNumberInputChange, handleSliderChange, handleROIChange } = this.props;
    const { validateValue } = this.props;

    return (
      <ExpansionPanel
        classes={{
          root: classes.root,
        }}
        elevation={1}
        style={{
          marginBottom: 16
        }}
      >
        <ExpansionPanelSummary classes={{ focused: classes.focused }} expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" className={classes.heading}>
            YOLO Configuration
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container>
            <FormControl
              margin="dense"
              fullWidth
              className={classes.formControl}
            >
              <Grid container>
                <Grid item md={4} style={{ paddingTop: 5 }}>
                  <FormLabel>Region of interest</FormLabel>
                </Grid>
                <Grid item container md={8} alignItems="center" spacing={16}>
                  <RadioGroup
                    aria-label="object detection type"
                    name="roiType"
                    value={state.roiType}
                    onChange={handleChange}
                    row
                    className={classes.formControl}
                  >
                    <FormControlLabel
                      value="all"
                      control={<CustomRadio />}
                      label="Whole frame"
                      className={classes.defaultRadio}
                    />
                    <FormControlLabel
                      value="custom"
                      control={<CustomRadio />}
                      label={`Custom: ${state.file === null ? '(pick a video file to enable)' : ''}`}
                      disabled={state.file === null}
                    />
                  </RadioGroup>
                  {state.roiType === "custom" ? (
                    <Grow in={state.roiType === "custom"}>
                      <ROIInput roi={state.roi} handleROIChange={handleROIChange} />
                    </Grow>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </FormControl>
            <FormControl
              margin="normal"
              fullWidth
              className={classes.formControl}
            >
              <Grid container alignItems="center">
                <Grid item md={4}>
                  <FormLabel component="legend">Neural network model</FormLabel>
                </Grid>
                <Grid item container md={8} alignItems="center" spacing={16}>
                  <Select
                    value={state.nnModel}
                    name="nnModel"
                    onChange={handleChange}
                  >
                    <MenuItem value="default">Default</MenuItem>
                    <MenuItem value="model1">Model 1</MenuItem>
                    <MenuItem value="model2">Model 2</MenuItem>
                    <MenuItem value="model3">Model 3</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </FormControl>
            <FormControl
              margin="normal"
              fullWidth
              className={classes.formControl}
            >
              <Grid container alignItems="center">
                <Grid item md={4}>
                  <FormLabel>Weights</FormLabel>
                </Grid>
                <Grid item container md={8} alignItems="center" spacing={16}>
                  <Select
                    value={state.weights}
                    name="weights"
                    onChange={handleChange}
                  >
                    <MenuItem value="default">Default</MenuItem>
                    <MenuItem value="weight1">Weight 1</MenuItem>
                    <MenuItem value="weight2">Weight 2</MenuItem>
                    <MenuItem value="weight3">Weight 3</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </FormControl>
            <FormControl
              margin="dense"
              fullWidth
              className={classes.formControl}
            >
              <Grid container>
                <Grid item md={4} style={{ paddingTop: 5 }}>
                  <FormLabel>Threshold</FormLabel>
                </Grid>
                <Grid item container md={8} alignItems="center" spacing={16}>
                  <RadioGroup
                    aria-label="object detection type"
                    name="thresholdType"
                    value={state.thresholdType}
                    onChange={handleChange}
                    row
                    className={classes.formControl}
                  >
                    <FormControlLabel
                      value="default"
                      control={<CustomRadio />}
                      label="Default (0.1)"
                      className={classes.defaultRadio}
                    />
                    <FormControlLabel
                      value="custom"
                      control={<CustomRadio />}
                      label={
                        <Grid container alignItems="center">
                          Custom:&nbsp;&nbsp;&nbsp;
                          <Input
                            value={
                              typeof state.threshold === "number"
                                ? state.threshold.toFixed(2)
                                : state.threshold
                            }
                            margin="none"
                            className={classes.numberInput}
                            disabled={state.thresholdType !== "custom"}
                            onChange={handleNumberInputChange(
                              "threshold",
                              0,
                              1
                            )}
                          />
                        </Grid>
                      }
                    />
                  </RadioGroup>
                  {state.thresholdType === "custom" ? (
                    <Grow in={state.thresholdType === "custom"}>
                      <Slider
                        classes={{ container: classes.slider }}
                        value={state.lastValidThreshold}
                        onChange={handleSliderChange("threshold", 0, 1)}
                        min={0}
                        max={1}
                        step={0.01}
                      />
                    </Grow>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </FormControl>
            <FormControl
              margin="dense"
              fullWidth
              className={classes.formControl}
            >
              <Grid container>
                <Grid item md={4} style={{ paddingTop: 5 }}>
                  <FormLabel>GPU use (%)</FormLabel>
                </Grid>
                <Grid item container md={8} alignItems="center" spacing={16}>
                  <RadioGroup
                    aria-label="object detection type"
                    name="gpuType"
                    value={state.gpuType}
                    onChange={handleChange}
                    row
                    className={classes.formControl}
                  >
                    <FormControlLabel
                      value="default"
                      control={<CustomRadio />}
                      label="Default (70%)"
                      className={classes.defaultRadio}
                    />
                    <FormControlLabel
                      value="custom"
                      control={<CustomRadio />}
                      label={
                        <Grid container alignItems="center">
                          Custom:&nbsp;&nbsp;&nbsp;
                          <Input
                            value={state.gpu}
                            margin="none"
                            className={classes.numberInput}
                            disabled={state.gpuType !== "custom"}
                            onChange={handleNumberInputChange("gpu", 0, 100)}
                            endAdornment={
                              <InputAdornment position="end">%</InputAdornment>
                            }
                          />
                        </Grid>
                      }
                    />
                  </RadioGroup>
                  {state.gpuType === "custom" ? (
                    <Grow in={state.gpuType === "custom"}>
                      <Slider
                        classes={{ container: classes.slider }}
                        value={state.lastValidGpu}
                        onChange={handleSliderChange("gpu", 0, 100)}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </Grow>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </FormControl>
            <FormControl
              margin="dense"
              fullWidth
              className={classes.formControl}
            >
              <Grid container>
                <Grid item md={4} style={{ paddingTop: 5 }}>
                  <FormLabel>Object filter:</FormLabel>
                </Grid>
                <Grid item container md={8} alignItems="center" spacing={16}>
                  <RadioGroup
                    aria-label="object detection type"
                    name="filterType"
                    value={state.filterType}
                    onChange={handleChange}
                    row
                    className={classes.formControl}
                  >
                    <FormControlLabel
                      value="all"
                      control={<CustomRadio />}
                      label="All"
                      className={classes.defaultRadio}
                      disabled={state.type !== "default"}
                    />
                    <FormControlLabel
                      value="custom"
                      control={<CustomRadio />}
                      label="Custom:"
                      disabled={state.type !== "default"}
                    />
                  </RadioGroup>
                  {state.filterType === "custom" ? (
                    <Grow in={state.filterType === "custom"}>
                      <FormControl fullWidth>
                        <Input
                          error={!validateValue("filter", /^(\w+\s*;\s*)*\w+$/)}
                          name="filter"
                          onChange={handleChange}
                          value={state.filter}
                          placeholder="Example: car; truck"
                        />
                        <FormHelperText>
                          Use semicolon to separate labels
                        </FormHelperText>
                      </FormControl>
                    </Grow>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </FormControl>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

AdvancedSettings.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AdvancedSettings);
