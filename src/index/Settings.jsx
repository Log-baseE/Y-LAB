import React, { Component } from 'react';
import BasicSettings from './BasicSettings';
import AdvancedSettings from './AdvancedSettings';

class Settings extends Component {
  render() {
    const { state } = this.props;
    const { handleChange, handleNumberInputChange, handleSliderChange, handleROIChange } = this.props;
    return ([
      <BasicSettings state={state} handleChange={handleChange} key={'basic'} />,
      <AdvancedSettings 
        state={state}
        handleNumberInputChange={handleNumberInputChange}
        handleChange={handleChange}
        handleSliderChange={handleSliderChange}
        handleROIChange={handleROIChange}
        key={'advanced'}
      />,
    ]);
  }
}

export default Settings;
