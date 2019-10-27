import React, { Component } from 'react';
import './App.scss';
import { Colors } from './colors';
import ReconnectingWebSocket from 'reconnecting-websocket';

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  timeZone: 'America/Chicago',
  weekday: 'long',
  day: 'numeric',
  month: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};
const dateTimeFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat(
  'en-US',
  dateTimeOptions,
);

interface IMessage {
  open: boolean;
  weather?: string;

  mentors?: string[];
  opensAt?: Date;
}

interface ISignState {
  updateTimeIntervalId?: NodeJS.Timeout;
  time?: string;

  messageSocket: ReconnectingWebSocket;
  lastMessage?: IMessage;
}

class App extends Component<any, ISignState> {
  constructor(props: any) {
    super(props);
    const messageSocket = new ReconnectingWebSocket(
      'wss://iot.vanderbilt.design/sign',
    );
    messageSocket.onmessage = msg =>
      this.setState({ lastMessage: JSON.parse(msg.data) as IMessage });
    this.state = { messageSocket };
    this.updateTime = this.updateTime.bind(this);
  }

  private updateTime() {
    this.setState({ time: dateTimeFormat.format(new Date()) });
  }

  public componentDidMount() {
    this.updateTime();
    this.setState({
      updateTimeIntervalId: setInterval(this.updateTime, 1000),
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
            : Colors.BLACK,
          color: Colors.WHITE,
        }}
      >
        <h2>Design Studio</h2>
        <h1>
          {this.state.lastMessage &&
            (this.state.lastMessage.open ? 'Open' : 'Closed')}
        </h1>
        <div className="row-reverse">
          <h3 className="time">
            {this.state.time &&
              this.state.time
                .replace(', ', ' ')
                .split(', ')
                .map((x, i) => <div key={i}>{x}</div>)}
            <div>
              {this.state.lastMessage && this.state.lastMessage.weather}
            </div>
          </h3>
          {this.state.lastMessage &&
            this.state.lastMessage.opensAt &&
            ((this.state.lastMessage.mentors &&
              this.state.lastMessage.mentors.length === 0) ||
              !this.state.lastMessage.mentors) && (
              <h3>
                `Opens at
                {this.state.lastMessage.opensAt.toLocaleTimeString(
                  'en-US',
                  dateTimeOptions,
                )}
                `
              </h3>
            )}
          {this.state.lastMessage &&
            this.state.lastMessage.mentors &&
            this.state.lastMessage.mentors.length > 0 && (
              <h3 className="mentors">
                Mentor{this.state.lastMessage.mentors.length > 1 ? 's' : ''} on
                Duty:
                <ul>
                  {this.state.lastMessage.mentors.map(mentor => (
                    <li>{mentor}</li>
                  ))}
                </ul>
              </h3>
            )}
        </div>
      </div>
    );
  }
}

export default App;
