import React, { Component } from 'react';
import BasicSettings from './BasicSettings';
import AdvancedSettings from './AdvancedSettings';

class Settings extends Component {
  render() {
    return ([
      <BasicSettings key={'basic'} />,
      <AdvancedSettings roi={this.props.roi} handleROIChange={this.props.handleROIChange} key={'advanced'}/>,
    ]);
  }
}

export default Settings;
