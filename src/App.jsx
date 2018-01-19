import React, { Component } from 'react';
import { HandWrite, SpellCheck } from './Input';
import Output from './Output';

const handwritingToken = 'TGWVH0Z1JA9A93J9:849SKSQTRNP52HA8';
const encoded = btoa(handwritingToken);

class App extends Component {
  constructor() {
    super();
    this.state = {
      inputText: '',
      imgURL: '',
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onHandwriteClick = this.onHandwriteClick.bind(this);
  }

  onInputChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [[name]]: value,
    });
    // const params = {
    //   handwriting_id: '5WGWVYD800X0',
    //   text: this.state.inputText,
    // };
    // const esc = encodeURIComponent;
    // const query = Object.keys(params).map(key => `${esc(key)}=${esc(params[key])}`).join('&');
    // //  later on... add option for pdf(download) or png(view)
    // const url = `https://api.handwriting.io/render/png?${query}`;
    // fetch(url, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Basic ${encoded}`,
    //   } })
    //     .then((response) => {
    //       this.setState({
    //         imgURL: response.url,
    //       });
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
  }

  onHandwriteClick(e) {
    e.preventDefault();
    //  creates query parameters for url
    const params = {
      handwriting_id: '5WGWVYD800X0',
      text: this.state.inputText,
    };
    const esc = encodeURIComponent;
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
  }

  render() {
    return (
      <div className='App'>
        <h1>Write a letter</h1>
        <div className='input-div'>
          <img src={ this.state.imgURL } alt='handwritten letter' />
          <HandWrite
            onInputChange={ this.onInputChange }
            onHandwriteClick={ this.onHandwriteClick }
          />
          <SpellCheck />
        </div>
        <Output />
      </div>
    );
  }
}

export default App;
