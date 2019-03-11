import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routes from './Routes'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import configureStore from './store'
import { IApplicationState } from './store'

interface IProps {
  store: Store<IApplicationState>;
}

const Root: React.SFC<IProps> = (props) => {
  return (
    <Provider store={props.store}>
      <Routes></Routes>
    </Provider>
  )
} 

ReactDOM.render(<Root store={configureStore()} />, document.getElementById('root') as HTMLElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
