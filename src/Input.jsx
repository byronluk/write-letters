import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HandWrite extends Component {

  render() {
    return (
      <form className='handwrite-form space-bottom'>
        <label htmlFor='inputText' className='input-text-label label-text'>
          Your Text
          <i className='fas fa-caret-down' />
          <textarea
            className='input-text textarea'
            name='inputText'
            onChange={ this.props.onInputChange }
            value={ this.props.updatedText }
          />
        </label>
        <button
          className='spellcheck-button button left-button-spacing'
          onClick={ this.props.onSpellCheckClick }
        >
          Spellcheck
        </button>
        <button
          className='download-button button right-button-spacing'
          onClick={ this.props.onDownloadClick }          
        >
          Download
        </button>
      </form>
    );
  }
}

HandWrite.propTypes = {
  onInputChange: PropTypes.func,
  onSpellCheckClick: PropTypes.func,
  onDownloadClick: PropTypes.func,
  updatedText: PropTypes.string,
  pdfData: PropTypes.string,
};

class SpellCheck extends Component {
  render() {
    return (
      <div className='spellcheck-container space-bottom'>
        { this.props.changesMade ?
          <form className='spellcheck-form'>
            <label htmlFor='spellCheckText' className='spellcheck-text-label label-text'>
              Updated Text
              <i className='fas fa-caret-down' />
              <textarea
                className='spellcheck-text textarea'
                name='spellCheckText'
                value={ this.props.updatedText }
                onChange={ this.props.onChange }
              />
            </label>
            <button
              className='reject-button button left-button-spacing'
              onClick={ this.props.onReject }
            >
              Reject
            </button>
            <button
              className='update-button button right-button-spacing'
              onClick={ this.props.onUpdate }
            >
              Update
            </button>
          </form> :
          <h3 className='no-errors depth-container'>Nothing to fix!</h3> }
      </div>
    );
  }
}

SpellCheck.propTypes = {
  updatedText: PropTypes.string,
  changesMade: PropTypes.bool,
  onChange: PropTypes.func,
  onReject: PropTypes.func,
  onUpdate: PropTypes.func,
};

module.exports = {
  HandWrite,
  SpellCheck,
};

