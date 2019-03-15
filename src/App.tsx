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

  messageSocket: WebSocket;
  lastMessage?: IMessage;
}

class App extends Component<any, ISignState> {
  constructor(props: any) {
    super(props);
    const messageSocket = new WebSocket("wss://iot.vanderbilt.design/sign");
    messageSocket.onmessage = msg => this.setState({lastMessage: JSON.parse(msg.data) as IMessage});
    this.state = {messageSocket};
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

    this.state.messageSocket.close();
  }

  public render() {
    return (
      <div
        className="app"
        style={{
          backgroundColor: this.state.lastMessage
            ? this.state.lastMessage.open
              ? Colors.GREEN
              : Colors.RED
            : Colors.WHITE,
          color: this.state.lastMessage ? Colors.WHITE : Colors.BLACK
        }}
      >
        <h2>Design Studio</h2>
        <h1>
          {this.state.lastMessage
            ? this.state.lastMessage.open
              ? "Open"
              : "Closed"
            : "Unknown"}
        </h1>
        <div className="row">
          {this.state.lastMessage &&
            this.state.lastMessage.mentors &&
            this.state.lastMessage.mentors.length !== 0 && (
              <h3 className="mentors">
                Mentor{this.state.lastMessage.mentors.length > 1 ? "s" : ""} on
                Duty:
                <ul>
                  {this.state.lastMessage.mentors.map(mentor => (
                    <li>{mentor}</li>
                  ))}
                </ul>
              </h3>
            )}
          <h3 className="time">
            {this.state.time}
            <br />
            {this.state.lastMessage && this.state.lastMessage.weather}
          </h3>
        </div>
      </div>
    );
  }
}

export default App;
