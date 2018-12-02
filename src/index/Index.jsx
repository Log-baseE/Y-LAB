import React, { Component } from "react";
import SplitPane from "react-split-pane";
import Settings from "./Settings";
import Preview from "./Preview";

class Index extends Component {
  render() {
    return (
      <SplitPane split="vertical" minSize={500} defaultSize={"50%"}>
        <Settings />
        <Preview />
      </SplitPane>
    );
  }
}

export default Index;
