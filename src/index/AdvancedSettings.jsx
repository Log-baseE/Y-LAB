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
  FormHelperText,
  Link,
  Tooltip
} from "@material-ui/core";
import { Slider } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";
import CustomRadio from "../custom/CustomRadio";
import IntegerInput from "../custom/IntegerInput";
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
    maxWidth: 70
  },
  subheading: {
    fontWeight: 'bold',
    marginTop: 24,
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    paddingTop: 6,
    paddingBottom: 6,
    fontSize: 12,
    lineHeight: 1.125,
  }
});

const tooltips = {
  roi: `Region of interest is an area that is isolated from each frame of the video to be processed. Parts outside of it won't be processed.`,
  filter: `Object filter specifies which objects should be detected from the video.`,
  confidence: `The confidence threshold specifies the minimum confidence level required for an object to be labeled.`,
  model: `The neural network model used for detecting objects from the video`,
  weights: `The neural network weights used for detecting objects from the video`,
  gpu: `Specifies how much of the GPU should be used for processing the video`,
  algo: `Choose which algorithm should be used for counting vehicles passing by`,
  flow: `If vehicles move from up to down or vice versa, use vertical. Use horizontal otherwise`,
  pxThres: `The minimum number of pixels between two vehicles to be considered separate`,
  timethres: `The minimum number of frames for a vehicle to be considered as a new one`,
  lanes: `The number of road lanes inside the video`,
  shoulder: `The percent of road width that is marked as a shoulder lane`,
  perspective: `Slide this around to adjust the lane lines to the actual lanes in the video`,
};

class AdvancedSettings extends Component {
  render() {
    const { classes } = this.props;
    const { state } = this.props;
    const { handleChange, handleNumberInputChange, handleSliderChange, handlePairedSliderChange, handleROIChange } = this.props;
    const { validateValue } = this.props;
    const { resetLanes } = this.props;

    return (
      <ExpansionPanel
        classes={{
          root: classes.root,
        }}
        elevation={1}
        style={{
          marginBottom: 16
        }}
        id='advanced-settings'
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" className={classes.heading}>
            OBJECT DETECTION PARAMETERS
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container>
          <FormControl
              margin="dense"
              fullWidth
              className={classes.formControl}
              id="roi"
            >
              <Grid container>
                <Grid item md={4} style={{ paddingTop: 5 }}>
                  <Tooltip title={tooltips.roi} placement="right" classes={{ tooltip: classes.tooltip }}>
                    <FormLabel>Region of interest</FormLabel>
                  </Tooltip>
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
                      label={state.file === null ? `Custom: (select a file to edit)` : `Custom`}
                      disabled={state.file === null}
                    />
                  </RadioGroup>
                  {state.roiType === "custom" ? (
                    <Grow in={state.roiType === "custom"} style={{transformOrigin: '50% 0 0'}}>
                      <ROIInput roi={state.tempROI} handleROIChange={handleROIChange} />
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
                  <Tooltip title={tooltips.filter} placement="right" classes={{ tooltip: classes.tooltip }}>
                    <FormLabel>Object filter:</FormLabel>
                  </Tooltip>
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
                    <Grow in={state.filterType === "custom"} style={{transformOrigin: '50% 0 0'}}>
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
            {
              state.type === "traffic" ? 
              <Grow in={state.type === "traffic"} style={{transformOrigin: '50% 0 0'}}>
              <span>
              <Typography variant="body1" gutterBottom={true} className={classes.subheading}>Car counting parameters</Typography>
                <FormControl
                  margin="dense"
                  fullWidth
                  className={classes.formControl}
                >
                  <Grid container>
                    <Grid item md={4} style={{ paddingTop: 5 }}>
                      <Tooltip title={tooltips.algo} placement="right" classes={{ tooltip: classes.tooltip }}>
                        <FormLabel>Algorithm</FormLabel>
                      </Tooltip>
                    </Grid>
                    <Grid item container md={8} alignItems="center" spacing={16}>
                      <RadioGroup
                        aria-label="Algorithm"
                        name="algorithm"
                        value={state.algorithm}
                        onChange={handleChange}
                        row
                        className={classes.formControl}
                      >
                        <FormControlLabel
                          value="madeleine"
                          control={<CustomRadio />}
                          label="Madeleine"
                          className={classes.defaultRadio}
                        />
                        <FormControlLabel
                          value="andrew"
                          control={<CustomRadio />}
                          label="Andrew"
                        />
                      </RadioGroup>
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
                      <Tooltip title={tooltips.flow} placement="right" classes={{ tooltip: classes.tooltip }}>
                        <FormLabel>Traffic flow direction</FormLabel>
                      </Tooltip>
                    </Grid>
                    <Grid item container md={8} alignItems="center" spacing={16}>
                      <RadioGroup
                        aria-label="direction"
                        name="direction"
                        value={state.direction}
                        onChange={handleChange}
                        row
                        className={classes.formControl}
                      >
                        <FormControlLabel
                          value="vertical"
                          control={<CustomRadio />}
                          label="Vertical"
                          className={classes.defaultRadio}
                        />
                        <FormControlLabel
                          value="horizontal"
                          control={<CustomRadio />}
                          label="Horizontal"
                        />
                      </RadioGroup>
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
                      <Tooltip title={tooltips.pxThres} placement="right" classes={{ tooltip: classes.tooltip }}>
                        <FormLabel>Pixel distance threshold</FormLabel>
                      </Tooltip>
                    </Grid>
                    <Grid item container md={8} alignItems="center" spacing={16}>
                      <RadioGroup
                        aria-label="object detection type"
                        name="pixelThresholdType"
                        value={state.pixelThresholdType}
                        onChange={handleChange}
                        row
                        className={classes.formControl}
                      >
                        <FormControlLabel
                          value="default"
                          control={<CustomRadio />}
                          label="Default (50)"
                          className={classes.defaultRadio}
                        />
                        <FormControlLabel
                          value="custom"
                          control={<CustomRadio />}
                          label={
                            <Grid container alignItems="center">
                              Custom:&nbsp;&nbsp;&nbsp;
                              <Input
                                value={state.pixelThreshold}
                                margin="none"
                                className={classes.numberInput}
                                disabled={state.pixelThresholdType !== "custom"}
                                onChange={handleNumberInputChange("pixelThreshold", 0, 1)}
                                inputComponent={IntegerInput}
                                endAdornment={<InputAdornment position="end">px</InputAdornment>}
                              />
                            </Grid>
                          }
                        />
                      </RadioGroup>
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
                      <Tooltip title={tooltips.timethres} placement="right" classes={{ tooltip: classes.tooltip }}>
                        <FormLabel>Frame distance threshold</FormLabel>
                      </Tooltip>
                    </Grid>
                    <Grid item container md={8} alignItems="center" spacing={16}>
                      <RadioGroup
                        aria-label="frame distance threshold"
                        name="timeThresholdType"
                        value={state.timeThresholdType}
                        onChange={handleChange}
                        row
                        className={classes.formControl}
                      >
                        <FormControlLabel
                          value="default"
                          control={<CustomRadio />}
                          label="Default (5)"
                          className={classes.defaultRadio}
                        />
                        <FormControlLabel
                          value="custom"
                          control={<CustomRadio />}
                          label={
                            <Grid container alignItems="center">
                              Custom:&nbsp;&nbsp;&nbsp;
                              <Input
                                value={state.timeThreshold}
                                margin="none"
                                className={classes.numberInput}
                                disabled={state.timeThresholdType !== "custom"}
                                onChange={handleNumberInputChange("timeThreshold", 0, 1)}
                                endAdornment={<InputAdornment position="end">frames</InputAdornment>}
                              />
                            </Grid>
                          }
                        />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                </FormControl>
                {
                  state.algorithm === "andrew" ?
                  [
                    <Grow in={state.algorithm === "andrew"} key="1" style={{transformOrigin: '50% 0 0'}}>
                      <FormControl
                        margin="dense"
                        fullWidth
                        className={classes.formControl}
                      >
                        <Grid container>
                          <Grid item md={4} style={{ paddingTop: 5 }}>
                            <Tooltip title={tooltips.lanes} placement="right" classes={{ tooltip: classes.tooltip }}>
                              <FormLabel>Lane count</FormLabel>
                            </Tooltip>
                          </Grid>
                          <Grid item container md={8} alignItems="center" spacing={16}>
                            <Grid item md={9}>
                              <Slider
                                // classes={{ container: classes.slider }}
                                value={state.lanes.count}
                                onChange={handleSliderChange("lanes.count")}
                                min={1}
                                max={10}
                                step={1}
                              />
                            </Grid>
                            <Grid item md={3}>
                              <Typography variant="body1">{(state.lanes.count + ' lane') + (state.lanes.count > 1 ? 's' : '')}</Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </FormControl>
                    </Grow>,
                    <Grow in={state.algorithm === "andrew"} key="2" style={{transformOrigin: '50% 0 0'}}>
                      <FormControl
                        margin="dense"
                        fullWidth
                        className={classes.formControl}
                      >
                        <Grid container>
                          <Grid item md={4} style={{ paddingTop: 5 }}>
                            <Tooltip title={tooltips.shoulder} placement="right" classes={{ tooltip: classes.tooltip }}>
                              <FormLabel>Shoulder size</FormLabel>
                            </Tooltip>
                          </Grid>
                          <Grid item container md={8} alignItems="center" spacing={16}>
                            <Grid item md={9}>
                              <Slider
                                // classes={{ container: classes.slider }}
                                value={state.lanes.shoulderSize}
                                onChange={handleSliderChange("lanes.shoulderSize")}
                                min={-1}
                                max={1}
                                step={0.01}
                              />
                            </Grid>
                            <Grid item md={3}>
                              <Typography variant="body1">{
                                (state.lanes.shoulderSize > 0 ? 'Left ' : state.lanes.shoulderSize < 0 ? 'Right ' : '') + 
                                (state.lanes.shoulderSize !== 0 ? Math.round(Math.abs(state.lanes.shoulderSize) * 100) + '%' : 'None')
                              }</Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </FormControl>
                    </Grow>,
                    <Grow in={state.algorithm === "andrew"} key="3" style={{transformOrigin: '50% 0 0'}}>
                      <FormControl
                        margin="dense"
                        fullWidth
                        className={classes.formControl}
                      >
                        <Grid container>
                          <Grid item md={4} style={{ paddingTop: 5 }}>
                            <Tooltip title={tooltips.perspective} placement="right" classes={{ tooltip: classes.tooltip }}>
                              <FormLabel>Perspective Sizing</FormLabel>
                            </Tooltip>
                          </Grid>
                          <Grid item container md={8} alignItems="center" spacing={16}>
                            <Grid item md={9}>
                              <Slider
                                // classes={{ container: classes.slider }}
                                value={state.lanes.perspectiveScaling}
                                onChange={handleSliderChange("lanes.perspectiveScaling")}
                                min={0.5}
                                max={1.5}
                                step={0.01}
                              />
                            </Grid>
                            <Grid item md={3}>
                              <Typography variant="body1">{(state.lanes.perspectiveScaling + '×')}</Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </FormControl>
                    </Grow>,
                    <Grow in={state.algorithm === "andrew"} key="4" style={{transformOrigin: '50% 0 0'}}>
                      <FormControl
                        margin="dense"
                        fullWidth
                        className={classes.formControl}
                      >
                        <Grid container alignContent="flex-end">
                          <Grid item md={12} style={{ paddingTop: 5 }}>
                            <Link component="button" style={{ color: 'white'}} underline="always" onClick={resetLanes}>Reset lanes</Link>
                          </Grid>
                        </Grid>
                      </FormControl>
                    </Grow>
                  ]
                  : ""
                }
              </span>
              </Grow>
              :
              ""
            }
            <Typography variant="body1" gutterBottom={true} className={classes.subheading}>Model options:</Typography>
            <FormControl
              margin="dense"
              fullWidth
              className={classes.formControl}
            >
              <Grid container>
                <Grid item md={4} style={{ paddingTop: 5 }}>
                  <Tooltip title={tooltips.confidence} placement="right" classes={{ tooltip: classes.tooltip }}>
                    <FormLabel>Confidence threshold</FormLabel>
                  </Tooltip>
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
                    <Grow in={state.thresholdType === "custom"} style={{transformOrigin: '50% 0 0'}}>
                      <Slider
                        classes={{ container: classes.slider }}
                        value={state.lastValidThreshold}
                        onChange={handlePairedSliderChange("threshold", 0, 1)}
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
              margin="normal"
              fullWidth
              className={classes.formControl}
            >
              <Grid container alignItems="center">
                <Grid item md={4}>
                  <Tooltip title={tooltips.model} placement="right" classes={{ tooltip: classes.tooltip }}>
                    <FormLabel component="legend">Neural network model</FormLabel>
                  </Tooltip>
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
                  <Tooltip title={tooltips.weights} placement="right" classes={{ tooltip: classes.tooltip }}>
                    <FormLabel>Weights</FormLabel>
                  </Tooltip>
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
                  <Tooltip title={tooltips.gpu} placement="right" classes={{ tooltip: classes.tooltip }}>
                    <FormLabel>GPU use (%)</FormLabel>
                  </Tooltip>
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
                    <Grow in={state.gpuType === "custom"} style={{transformOrigin: '50% 0 0'}}>
                      <Slider
                        classes={{ container: classes.slider }}
                        value={state.lastValidGpu}
                        onChange={handlePairedSliderChange("gpu", 0, 100)}
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
