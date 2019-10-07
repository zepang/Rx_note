import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Confirm from "./Confirm";

interface IState {
  confirmOpen: boolean;
  confirmMessage: string;
  confirmVisible: boolean;
  countDown: number;
}
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      confirmMessage: "Please hit the confirm button",
      confirmOpen: false,
      confirmVisible: true,
      countDown: 10
    }
  }
  private timer: number = 0;
  private renderCount = 0;
  private handleCancelConfirmClick = () => {
    this.setState({
      confirmMessage: "Cool, carry on reading!",
      confirmOpen: false
    })
    clearInterval(this.timer);
  };
  private handleOkConfirmClick = () => {
    this.setState({
      confirmMessage: "Take a break, I'm sure you will later...",
      confirmOpen: false
    })
    clearInterval(this.timer);
  };
  private handleConfirmClick = () => {
    this.setState({
      confirmOpen: true
    })
    clearInterval(this.timer);
  }
  private handleTimerTick() {
    this.setState({
      confirmMessage: `Please hit the confirm button ${this.state.countDown} secs to go`,
      countDown: this.state.countDown - 1
    });
    if (this.state.countDown <= 0) {
      clearInterval(this.timer);
      this.setState({
        confirmMessage: "Too late to confirm!",
        confirmVisible: false
      });
    }
  }
  public static getDerivedStateFromProps (props: {}, state: IState) {
    console.log("%c getDerivedStateFromProps", "color:green;font-weight:bold;", props, state)
    return null
  }
  public getSnapshotBeforeUpdate (prevProps: {}, prevState:IState) {
    this.renderCount += 1
    console.log("%c getSnapshotBeforeUpdate", "color:red;font-weight:bold;", prevProps, prevState,{ renderCount: this.renderCount })
    return this.renderCount;
  }
  public shouldComponentUpdate (nextProps: {}, nextState: IState) {
    console.log("%c shouldComponentUpdate", "color:orange;font-weight:bold;",nextProps, nextState);
    return true;
  }
  public componentDidUpdate(prevProps: {}, prevState: IState, snapshot: number) {
    console.log("%c omponentDidUpdate", "color:blue;font-weight:bold;", prevProps, prevState, snapshot, { renderCount: this.renderCount });
  }
  public componentDidMount() {
    this.timer = window.setInterval(() => this.handleTimerTick(),1000);
  }
  public componentWillUnmount() {
    clearInterval(this.timer);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <p>{this.state.confirmMessage}</p>
        {this.state.confirmVisible && (<button onClick={this.handleConfirmClick}>Confirm</button>)}
        {this.state.countDown && 
          (<Confirm
            title="React and TypeScript"
            content="Are you sure you want to learn React and TypeScript?"
            cancelCaption="No way"
            okCaption="Yes please!"
            onCancelClick={this.handleCancelConfirmClick}
            onOkClick={this.handleOkConfirmClick}
            open={this.state.confirmOpen}
          />)
        }
      </div>
    );
  }
}

export default App;
