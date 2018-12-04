import React, { Component } from 'react';
import VideoDetails from './VideoDetails';
import ResultDetails from './ResultDetails';

class Details extends Component {
  render() {
    const { state } = this.props;
    return ([
      <ResultDetails 
        state={state}
        key={'resultdetails'}
      />,
      <VideoDetails
        state={state}
        key={'videodetails'} 
      />,
    ]);
  }
}

export default Details;
