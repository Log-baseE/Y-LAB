import React, { Component } from "react";
import IndexScreen from "./index/IndexScreen";
import ProgressScreen from "./progress/ProgressScreen";
import ResultScreen from "./result/ResultScreen";

import "./App.scss";

const electron = window.require("electron");
const { remote, ipcRenderer } = electron;
const path = remote.require("path");
const fs = remote.require("fs");
const { dialog } = remote;

class App extends Component {
  state = {
    stage: 0,
    options: null,
    result: null,
    runTutorial: true,
    tutorialIndex: 0,
  };

  componentDidMount() {
    ipcRenderer.on('replay-tutorial', (event, arg) => {
      this.restartTutorial();
    });
  }

  handleSubmit = options => event => {
    this.setState({
      stage: this.state.stage + 1,
      options: options
    });
  };

  handlePrevious = event => {
    this.setState({
      stage: this.state.stage - 1
    });
  };

  handleResult = fileName => event => {
    let result = JSON.parse(
      fs.readFileSync(fileName, "utf8")
    );
    console.log(result)
    this.setState({
      stage: 2,
      result: result
    });
  };

  handleRestart = event => {
    this.setState({
      stage: 0
    });
  };

  handleSaveOptions = options => event => {
    // process options
    var content = JSON.stringify(options);
    dialog.showSaveDialog(
      remote.getCurrentWindow(),
      {
        defaultPath: "*/options.json",
        filters: [{ name: "JSON file", extensions: ["json"] }]
      },
      function (fileName) {
        if (fileName === undefined) {
          console.log("save cancelled");
          return;
        }

        fs.writeFile(fileName, content, err => {
          if (err) {
            alert(
              "An error occurred while creating the file. Please see logs for details"
            );
            console.log(err);
          }
          alert(`Options saved to ${fileName}`);
        });
      }
    );
    // open save dialog
    // write to file
    // alert("save clicked");
    console.log(options);
  };

  renderScreen = () => {
    let screens = [
      <IndexScreen
        state={this.state.options}
        runTutorial={this.state.runTutorial}
        tutorialIndex={this.state.tutorialIndex}
        handleSubmit={this.handleSubmit}
        handleSave={this.handleSaveOptions}
        completeTutorial={this.completeTutorial}
        setTutorialIndex={this.setTutorialIndex}
        key="index"
      />,
      <ProgressScreen
        options={this.state.options}
        handlePrevious={this.handlePrevious}
        handleResult={this.handleResult}
        key="progress"
      />,
      <ResultScreen
        options={this.state.options}
        result={this.state.result}
        handleRestart={this.handleRestart}
        key="results"
      />
    ];
    return screens[this.state.stage];
  };

  setTutorialIndex = (index) => {
    this.setState({
      tutorialIndex: index,
    })
  }

  completeTutorial = () => {
    this.setState({
      runTutorial: false,
    })
  }

  restartTutorial = () => {
    this.setState({
      runTutorial: true,
      tutorialIndex: 0,
    })
  }

  render() {
    return this.renderScreen();
  }
}

export default App;
