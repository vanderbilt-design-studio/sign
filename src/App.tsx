import React, { Component } from "react";
import "./App.css";
import { Colors } from "./colors";

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  timeZone: "America/Chicago",
  weekday: "long",
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

interface IMessage {
  open: boolean;
  mentors?: string[];
  weather?: string;
}

interface ISignState {
  updateTimeIntervalId?: NodeJS.Timeout;
  time?: string;

  lastUpdate?: IMessage;
}

class App extends Component<any, ISignState> {
  constructor(props: any) {
    super(props);
    this.state = {lastUpdate: {
      open: true,
      mentors: ["Daiwei L", "Sameer P", "Christina H"],
      weather: "⛅️ 🌡️+73°F 🌬️↑23 mph"
    }};
    this.updateTime = this.updateTime.bind(this);
  }

  private updateTime() {
    this.setState({ time: dateTimeFormat.format(new Date()) });
  }

  public componentDidMount() {
    this.updateTime();
    this.setState({
      updateTimeIntervalId: setInterval(this.updateTime, 1000)
    });
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
          backgroundColor: this.state.lastUpdate
            ? this.state.lastUpdate.open
              ? Colors.GREEN
              : Colors.RED
            : Colors.WHITE,
          color: this.state.lastUpdate ? Colors.WHITE : Colors.BLACK
        }}
      >
        <h2>Design Studio</h2>
        <h1>
          {this.state.lastUpdate
            ? this.state.lastUpdate.open
              ? "Open"
              : "Closed"
            : "Unknown"}
        </h1>
        <div className="row">
          {this.state.lastUpdate && this.state.lastUpdate.mentors && this.state.lastUpdate.mentors.length !== 0 && (
            <h3 className="mentors">
              Mentor{this.state.lastUpdate.mentors.length > 1 ? "s" : ""} on
              Duty:
              <ul>
              {this.state.lastUpdate.mentors.map(mentor => <li>{mentor}</li>)}
              </ul>
            </h3>
          )}
          <h3 className="time">{this.state.time}<br/>{this.state.lastUpdate && this.state.lastUpdate.weather}</h3>
        </div>
      </div>
    );
  }
}

export default App;
