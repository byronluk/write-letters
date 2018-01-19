import React, { Component } from 'react';
import { HandWrite, SpellCheck } from './Input';
import Output from './Output';
import { handwritingKey, spellCheckKey } from '../server/config';
const debounce = require('lodash.debounce');

//  get apiKey from handwriting.io
const encoded = btoa(handwritingKey);

class App extends Component {
  constructor() {
    super();
    this.state = {
      inputText: '',
      spellcheckText: '',
      spellcheckEnabled: false,
      imgURL: '',
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onDownloadClick = this.onDownloadClick.bind(this);
    this.delayHandwrite = this.delayHandwrite.bind(this);
    this.onSpellCheckClick = this.onSpellCheckClick.bind(this);
  }
  // sends request after debounce and x amount of seconds
  delayHandwrite = debounce(() => {
    if (!this.state.inputText) {
      return (this.setState({
        imgURL: '',
      }));
    }
    const params = {
      handwriting_id: '5WGWVYD800X0',
      text: this.state.inputText,
    };
    const esc = encodeURIComponent;
    //  creates query parameters for url
    const query = Object.keys(params).map(key => `${esc(key)}=${esc(params[key])}`).join('&');
    //  later on... add option for pdf(download) or png(view)
    const url = `https://api.handwriting.io/render/png?${query}`;
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${encoded}`,
      } })
        .then((response) => {
          this.setState({
            imgURL: response.url,
          });
        })
        .catch((error) => {
          console.error(error);
        });
  }, 500);

  onInputChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [[name]]: value,
    });
    this.delayHandwrite();
  }

  onDownloadClick(e) {
    e.preventDefault();
  }

  onSpellCheckClick(e) {
    e.preventDefault();
    this.setState({
      spellcheckEnabled: true,
    })
  } 

  render() {
    return (
      <div className='App'>
        <h1>Write a letter</h1>
        <div className='input-div'>
          <HandWrite
            onInputChange={ this.onInputChange }
            onDownloadClick={ this.onDownloadClick }
            onSpellCheckClick={ this.onSpellCheckClick }
          />
          { this.state.spellcheckEnabled &&
          <SpellCheck />
          }
        </div>
        <Output imgSRC={ this.state.imgURL } />
      </div>
    );
  }
}

export default App;
