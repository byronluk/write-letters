/* things to do
optional: add a download button to download pdf
optional: add in a select dropdown for handwriting style options
add in error handlers and loading handlers(if necessary)
*/
import React, { Component } from 'react';
import { HandWrite, SpellCheck } from './Input';
import Output from './Output';
// spellcheck api is from microsoft bing - 30 day free trial
// import { handwritingKey, spellCheckKey } from '../config';
//  heroku environment variables
var spellCheckKey = process.env.SPELLCHECK_API_KEY;
console.log(spellCheckKey);
var handwritingKey = process.env.HANDWRITE_API_KEY;

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
  //  searches for special characters at end of input or whitespace
  const characterRegex = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?\.]$/;
  const words = input.split(' ');
  let responseIterator = 0;

  for (let inputIterator = 0; inputIterator < words.length; inputIterator++) {
    //  checks for special characters
    if (characterRegex.test(words[inputIterator])) {
      //exec grabs value of character
      var character = characterRegex.exec(words[inputIterator])[0];
      // removes special character from input since get response returns tokens without characters
      // allows for proper matching at below if statement
      words[inputIterator] = words[inputIterator].replace(characterRegex, '');
    } else {
      var character = '';
    }
    //  check if word matches token returned - if so - swap word out with suggestion
    if (!!tokens[responseIterator] && words[inputIterator] === tokens[responseIterator].token) {
      words.splice(inputIterator, 1, tokens[responseIterator].suggestions[0].suggestion + character);
      responseIterator++;
    } else {
      // if no match returns word back to prior state
      words[inputIterator] += character;
    }
  }
  return addLineBreaks(words.join(' '));
}
// Replaces all line breaks with ' New line '
function replaceLineBreaks(input) {
  var lineBreakRegex = /(\r\n|\n|\r)/gm;
  return input.replace(lineBreakRegex, ' New line ');
}
//  Replaces ' New line ' with line breaks
function addLineBreaks(input) {
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
    this.onUpdateClick = this.onUpdateClick.bind(this);
    this.onRejectClick = this.onRejectClick.bind(this);
  }
  //  function will run after 1/2 second of inactivity
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
      handwriting_id: '5WGWVV8800VH',
      text: filteredText,
    };
    //  creates query parameters for url
    const query = queryBuilder(params);
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
  //  get request to /pdf
    e.preventDefault();
    return alert('button not working yet... sorry!');
  }

  onSpellCheckClick(e) {
    e.preventDefault();
    if (!this.state.inputText) {
      return alert('Please enter text for me to check');
    }
    const stateCopy = Object.assign({}, this.state);
    // removes line breaks so api will return something
    const singleLine = replaceLineBreaks(stateCopy.inputText);
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

  onUpdateClick(e) {
    e.preventDefault();
    const updatedText = this.state.spellCheckText;
    this.setState({
      inputText: updatedText,
      spellCheckEnabled: false,
    });
    this.delayHandwrite();
  }
  onRejectClick(e) {
    e.preventDefault();
    this.setState({
      spellCheckEnabled: false,
    });
  }

  render() {
    return (
      <div className='App'>
        <h1 className='page-title'>Write a letter</h1>
        <div className='input-div'>
          <HandWrite
            onInputChange={ this.onInputChange }
            onDownloadClick={ this.onDownloadClick }
            onSpellCheckClick={ this.onSpellCheckClick }
            updatedText={ this.state.inputText }
          />
          { this.state.spellCheckEnabled &&
          <SpellCheck
            updatedText={ this.state.spellCheckText }
            changesMade={ this.state.changesMade }
            onChange={ this.onInputChange }
            onUpdate={ this.onUpdateClick }
            onReject={ this.onRejectClick }
          />
          }
        </div>
        <Output imgSRC={ this.state.imgURL } />
      </div>
    );
  }
}

export default App;
