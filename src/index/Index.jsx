import React, { Component } from "react";
import SplitPane from "react-split-pane";
import Settings from "./Settings";
import Preview from "./Preview";

class Index extends Component {
  state = {
    roi: {
      topLeft: {
        x: 0,
        y: 0
      },
      topRight: {
        x: 0,
        y: 0
      },
      bottomLeft: {
        x: 0,
        y: 0
      },
      bottomRight: {
        x: 0,
        y: 0
      },
    }
  };

  handleROIChange = (position, component) => event => {
    let roi = Object.assign({}, this.state.roi);
    roi[position][component] = event.target.value;
    this.setState({roi});
  }

  render() {
    return (
      <SplitPane split="vertical" minSize={500} defaultSize={"50%"}>
        <Settings roi={this.state.roi} handleROIChange={this.handleROIChange} />
        <Preview />
      </SplitPane>
    );
  }
}

export default Index;
