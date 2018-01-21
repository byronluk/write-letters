/* things to do
add in functionality for update and reject buttons
optional: add a download button to download pdf
add in error handlers and loading handlers(if necessary)
style and finish
*/
import React, { Component } from 'react';
import { HandWrite, SpellCheck } from './Input';
import Output from './Output';
// spellcheck api is from microsoft bing - 30 day free trial
import { handwritingKey, spellCheckKey } from '../server/config';
const debounce = require('lodash.debounce');

//  get apiKey from handwriting.io
const encoded = btoa(handwritingKey);

function queryBuilder(params) {
  const esc = encodeURIComponent;
  return (Object
          .keys(params)
          .map(key => `${esc(key)}=${esc(params[key])}`)
          .join('&'));
}
function spellCheckParser(input, tokens) {
  if (tokens.length < 1) {
    return addLineBreaks(input);
  }
  //  searches for special characters at end of input
  const characterRegex = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?\.]$/;
  const words = input.split(' ');
  let responseIterator = 0;

  for (let inputIterator = 0; inputIterator < words.length; inputIterator++) {
    //  checks for special characters
    if (characterRegex.test(words[inputIterator])) {
      //exec grabs value of character
      var character = characterRegex.exec(words[inputIterator])[0];
      // removes special character from input since response returns tokens without unnecessary characters
      // allows for proper matching at below if statement
      words[inputIterator] = words[inputIterator].replace(characterRegex, '');
    } else {
      //  if no special character at end of input... leave blank
      var character = '';
    }
    if (!!tokens[responseIterator] && words[inputIterator] === tokens[responseIterator].token) {
      words.splice(inputIterator, 1, tokens[responseIterator].suggestions[0].suggestion + character);
      responseIterator++;
    } else {
      // if no match... patches the word back up to normal
      words[inputIterator] += character;
    }
  }
  return addLineBreaks(words.join(' '));
}
//  removes \n to format text for get request
//  replaces \n with ' new line '
function replaceLineBreaks(input) {
  var lineBreakRegex = /(\r\n|\n|\r)/gm;
  return input.replace(lineBreakRegex, ' New line ');
}
//  reformats results and replaces ' new line ' with \n
function addLineBreaks(input) {
  var y = input.replace(/\sNew\sline\s/g, '\n');
  console.log(y);
  return input.replace(/\sNew\sline\s/g, '\n');
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      inputText: '',
      spellCheckText: '',
      spellCheckEnabled: false,
      changesMade: false,
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
    const stateCopy = Object.assign({}, this.state);
    //  removes text that will break the img
    const filteredText = stateCopy.inputText.replace(/[`<>\\\[\]{}_\^]/gi, '');
    const params = {
      handwriting_id: '5WGWVYD800X0',
      text: filteredText,
    };
    //  creates query parameters for url
    const query = queryBuilder(params);
    //  later on... add option for pdf(download) or png(view)
    const url = `https://api.handwriting.io/render/png?${query}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${encoded}`,
      } })
      .then((response) => {
        this.setState({
          imgURL: response.url,
        })
      })
      .catch((error) => {
        return (console.error(error));
      });
  }, 500);

  onInputChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [[name]]: value,
    });
    if (name === 'spellCheckText') {
      return;
    }
    this.delayHandwrite();
  }

  onDownloadClick(e) {
    e.preventDefault();
  }

  onSpellCheckClick(e) {
    const stateCopy = Object.assign({}, this.state);
    // removes line breaks
    const singleLine = replaceLineBreaks(stateCopy.inputText);
    e.preventDefault();
    const params = {
      text: singleLine,
    };
    const query = queryBuilder(params);
    const url = `https://api.cognitive.microsoft.com/bing/v7.0/spellcheck?${query}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Ocp-Apim-Subscription-Key': spellCheckKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      } })
      .then((response) => response.json())
      .then((response) => {
        const updatedText = spellCheckParser(singleLine, response.flaggedTokens);
        const changesMade = response.flaggedTokens.length > 0;
        this.setState({
          spellCheckText: updatedText,
          spellCheckEnabled: true,
          changesMade,
        })
      })
      .catch((err) => {
        return console.log(err);
      });
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
          { this.state.spellCheckEnabled &&
          <SpellCheck
            updatedText={ this.state.spellCheckText }
            changesMade={ this.state.changesMade }
            onChange={ this.onInputChange }
          />
          }
        </div>
        <Output imgSRC={ this.state.imgURL } />
      </div>
    );
  }
}

export default App;
