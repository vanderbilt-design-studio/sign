import React, { Component } from "react";
import "./App.css";

interface ISignState {
  updateTimeIntervalId?: NodeJS.Timeout;
  timeString: string;
  open?: boolean;
}

class App extends Component<any, ISignState> {
  constructor(props: any) {
    super(props);
    this.state = { timeString: "" };
    this.updateTime = this.updateTime.bind(this);
  }

  private updateTime() {
    this.setState({ timeString: new Date().toLocaleString("en-US") });
  }

  public componentDidMount() {
    this.setState({ updateTimeIntervalId: setInterval(this.updateTime, 1000) });
  }

  public componentWillUnmount() {
    if (this.state.updateTimeIntervalId) {
      clearInterval(this.state.updateTimeIntervalId);
    }
  }

  public render() {
    return (
      <div className="app">
        <h2>Design Studio</h2>
        <h1>
          {!!this.state.open ? (this.state.open ? "Open" : "Closed") : "???"}
        </h1>
        <div className="row">
          <h3>Lorem Ipsum</h3>
          <h3>{this.state.timeString}</h3>
        </div>
      </div>
    );
  }
}

export default App;
