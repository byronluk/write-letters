import React, { Component } from 'react';

class Output extends Component {

  render() {
    return (
      <div className='output-div'>
        <h2 className='label-text'>Your Letter</h2>
        <i className='fas fa-caret-down' />
        <div className='img-container'>
        { this.props.imgSRC ?
          <img src={ this.props.imgSRC } alt='handwritten-letter' />
        : <h3 className='no-input'>Start typing in the box to your left!</h3>
        }
        </div>
      </div>
    );
  }
}

export default Output;
