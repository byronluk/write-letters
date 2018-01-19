import React, { Component } from 'react';

class Output extends Component {

  render() {
    return (
      <div className='output-div'>
        <h2>output box</h2>
        { this.props.imgSRC ?
          <img src={ this.props.imgSRC } alt='handwritten-letter' />
        : <h3>Go ahead and type</h3>
        }
      </div>
    );
  }
}

export default Output;
