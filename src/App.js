import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import Filter from './components/Filter';
import store from './core/redux/store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Filter/>
        </div>
      </Provider>
    );
  }
}

export default App;
