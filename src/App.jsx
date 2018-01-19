import React, { Component } from 'react';
import { HandWrite, SpellCheck } from './Input';
import Output from './Output';

class App extends Component {
  constructor() {
    super();
    this.state = {

    };
  }

  render() {
    return (
      <div className='App'>
        <h1>Write a letter</h1>
        <div className='input-div'>
          <HandWrite />
          <SpellCheck />
        </div>
        <Output />
      </div>
    );
  }
}

export default App;
