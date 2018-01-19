import React, { Component } from 'react';

class HandWrite extends Component {

  render() {
    return (
      <form className='handwrite-form'>
        <textarea className='input-text' name='inputText' onChange={ this.props.onInputChange } />
        <button className='spellcheck-button'>
          SpellCheck
        </button>
        <button className='handwrite-button' onClick={ this.props.onHandwriteClick }>
          Handwrite
        </button>
      </form>
    );
  }
}

class SpellCheck extends Component {

  render() {
    return (
      <form className='spellcheck-form'>
        <textarea className='spellcheck-text' name='spellcheckText' />
        <button className='reject-button'>
          Reject
        </button>
        <button className='update-button'>
          Update
        </button>
      </form>
    );
  }
}

module.exports = {
  HandWrite,
  SpellCheck,
};

