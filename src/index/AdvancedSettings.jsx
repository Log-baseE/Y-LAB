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

const styles = theme => ({
  input: {
    display: "none"
  },
  root: {
    margin: theme.spacing.unit * 2,
    borderRadius: 4,
  },
  formControl: {
    width: "100%"
  },
  defaultRadio: {
    width: `${100/3}%`
  },
  slider: {
    padding: "12px 0",
    marginBottom: 24,
  },
  numberInput: {
    maxWidth: 50
  }
});

class AdvancedSettings extends Component {
  state = {
    type: "default",
    nnModel: "default",
    weights: "default",
    threshold: 0.1,
    lastValidThreshold: 0.1,
    gpu: 70,
    lastValidGpu: 70,
    thresholdType: "default",
    gpuType: "default",
    filterType: "all",
    filter: "",
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSliderChange = (name, min, max) => (event, value) => {
    this.setState({ [name]: value });
    if (!isNaN(parseFloat(value))) {
      var val = parseFloat(value);
      if (val >= min && val <= max) {
        this.setState({
          [`lastValid${name.charAt(0).toUpperCase() + name.slice(1)}`]: val
        });
      }
    }
  };

  handleNumberInputChange = (name, min, max) => event => {
    this.setState({ [name]: event.target.value });
    if (!isNaN(parseFloat(event.target.value))) {
      var val = parseFloat(event.target.value);
      if (val >= min && val <= max) {
        this.setState({
          [`lastValid${name.charAt(0).toUpperCase() + name.slice(1)}`]: val
        });
      }
    }
  };

  validateValue = (key, format) => {
    return format.test(this.state[key]);
  }

  render() {
    const { classes } = this.props;

    return (
      <ExpansionPanel classes={{
        root: classes.root,
      }} elevation={1} defaultExpanded style={{
        marginBottom: 16,
      }}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" className={classes.heading}>
            YOLO Configuration
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container>
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
                    value={this.state.nnModel}
                    name="nnModel"
                    onChange={this.handleChange}
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
                    value={this.state.weights}
                    name="weights"
                    onChange={this.handleChange}
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
                    value={this.state.thresholdType}
                    onChange={this.handleChange}
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
                              typeof this.state.threshold === "number"
                                ? this.state.threshold.toFixed(2)
                                : this.state.threshold
                            }
                            margin="none"
                            className={classes.numberInput}
                            disabled={this.state.thresholdType !== "custom"}
                            onChange={this.handleNumberInputChange(
                              "threshold",
                              0,
                              1
                            )}
                          />
                        </Grid>
                      }
                    />
                  </RadioGroup>
                  {this.state.thresholdType === "custom" ? (
                    <Grow in={this.state.thresholdType === "custom"}>
                      <Slider
                        classes={{ container: classes.slider }}
                        value={this.state.lastValidThreshold}
                        onChange={this.handleSliderChange("threshold", 0, 1)}
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
                    value={this.state.gpuType}
                    onChange={this.handleChange}
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
                            value={this.state.gpu}
                            margin="none"
                            className={classes.numberInput}
                            disabled={this.state.gpuType !== "custom"}
                            onChange={this.handleNumberInputChange(
                              "gpu",
                              0,
                              100
                            )}
                            endAdornment={
                              <InputAdornment position="end">%</InputAdornment>
                            }
                          />
                        </Grid>
                      }
                    />
                  </RadioGroup>
                  {this.state.gpuType === "custom" ? (
                    <Grow in={this.state.gpuType === "custom"}>
                      <Slider
                        classes={{ container: classes.slider }}
                        value={this.state.lastValidGpu}
                        onChange={this.handleSliderChange("gpu", 0, 100)}
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
                    value={this.state.filterType}
                    onChange={this.handleChange}
                    row
                    className={classes.formControl}
                  >
                    <FormControlLabel
                      value="all"
                      control={<CustomRadio />}
                      label="All"
                      className={classes.defaultRadio}
                    />
                    <FormControlLabel
                      value="custom"
                      control={<CustomRadio />}
                      label="Custom:"
                    />
                  </RadioGroup>
                  {this.state.filterType === "custom" ? (
                    <Grow in={this.state.filterType === "custom"}>
                      <FormControl fullWidth>
                        <Input 
                          error={!this.validateValue('filter', /^(\w+;)*\w+$/)}
                          name="filter"
                          onChange={this.handleChange}
                          value={this.state.filter}
                          placeholder="Example: car; truck"
                        />
                        <FormHelperText>Use semicolon to separate labels</FormHelperText>
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
