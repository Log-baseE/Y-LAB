import React, { Component } from 'react';
import BasicSettings from './BasicSettings';
import AdvancedSettings from './AdvancedSettings';

class Settings extends Component {
  render() {
    const { state } = this.props;
    const { handleChange, handleNumberInputChange, handlePairedSliderChange, handleSliderChange, handleROIChange, handleFileChange } = this.props;
    const { validateValue, resetLanes } = this.props;
    return ([
      <BasicSettings
        state={state}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        key={'basic'} />,
      <AdvancedSettings 
        state={state}
        handleNumberInputChange={handleNumberInputChange}
        handleChange={handleChange}
        handlePairedSliderChange={handlePairedSliderChange}
        handleSliderChange={handleSliderChange}
        handleROIChange={handleROIChange}
        validateValue={validateValue}
        resetLanes={resetLanes}
        key={'advanced'}
      />,
    ]);
  }
}

export default Settings;
