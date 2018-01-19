import React, { Component } from 'react';

class HandWrite extends Component {

  render() {
    return (
      <form className='handwrite-form'>
        <textarea className='input-text' />
        <button className='spellcheck-button'>
          SpellCheck
        </button>
        <button className='handwrite-button'>
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
        <textarea className='spellcheck-text' />
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

