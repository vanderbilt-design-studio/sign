import React, { Component } from "react";
import "./App.css";
import { Colors } from "./colors";

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  timeZone: "America/Chicago",
  weekday: "short",
  day: "numeric",
  month: "numeric",
  hour: "numeric",
  minute: "numeric",
  year: "2-digit"
};
const dateTimeFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat(
  "en-US",
  dateTimeOptions
);

interface IOpenMessage {
  open: boolean;
  mentor?: string;
}

interface ISignState {
  updateTimeIntervalId?: NodeJS.Timeout;
  timeString: string;
  lastOpenMessage?: IOpenMessage;
}

class App extends Component<any, ISignState> {
  constructor(props: any) {
    super(props);
    this.state = { timeString: "" };
    this.updateTime = this.updateTime.bind(this);
  }

  private updateTime() {
    this.setState({ timeString: dateTimeFormat.format(new Date())});
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
      <div
        className="app"
        style={{
          backgroundColor: this.state.lastOpenMessage
            ? this.state.lastOpenMessage.open
              ? Colors.GREEN
              : Colors.RED
            : Colors.WHITE
        }}
      >
        <h2>Design Studio</h2>
        <h1>
          {this.state.lastOpenMessage
            ? this.state.lastOpenMessage.open
              ? "Open"
              : "Closed"
            : "Unknown"}
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
