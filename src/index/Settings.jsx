import React, { Component } from 'react';
import { Divider } from '@material-ui/core';
import BasicSettings from './BasicSettings';
import AdvancedSettings from './AdvancedSettings';

class Settings extends Component {
  render() {
    return ([
      <BasicSettings />,
      <AdvancedSettings />
    ]);
  }
}

export default Settings;
