import React, { Component } from 'react';

class HandWrite extends Component {

  render() {
    return (
      <form className='handwrite-form'>
        <textarea
          className='input-text'
          name='inputText'
          onChange={ this.props.onInputChange }
          value={ this.props.updatedText }
        />
        <button className='spellcheck-button' onClick={ this.props.onSpellCheckClick }>
          SpellCheck
        </button>
        <button className='download-button' onClick={ this.props.onDownloadClick }>
          Download
        </button>
      </form>
    );
  }
}

class SpellCheck extends Component {
  render() {
    return (
      <div className='spellcheck-container'>
        { this.props.changesMade ?
          <form className='spellcheck-form'>
            <textarea
              className='spellcheck-text'
              name='spellCheckText'
              value={ this.props.updatedText }
              onChange={ this.props.onChange }
            />
            <button className='reject-button' onClick={ this.props.onReject }>
              Reject
            </button>
            <button className='update-button' onClick={ this.props.onUpdate }>
              Update
            </button>
          </form> :
          <h3 className='no-errors'>Nothing to fix!</h3> }
      </div>
    );
  }
}

module.exports = {
  HandWrite,
  SpellCheck,
};

