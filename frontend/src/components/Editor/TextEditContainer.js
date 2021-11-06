import React, { Component } from 'react';
import QuillEditor from './QuillEditor.js';

class TextEditContainer extends Component {
  constructor() {
    super()
    this.state = {
      // connectionExists: false,
      connectionExists: true,
      choice: '',
      showRoom: 'room1', //default
      // showRoom: '', //default
    };
    this.onChoiceClick = this.onChoiceClick.bind(this)
    this.onButtonClick = this.onButtonClick.bind(this)
    this.setConnectionExistsToTrue = this.setConnectionExistsToTrue.bind(this)
    this.setConnectionExistsToFalse = this.setConnectionExistsToFalse.bind(this)
  } //end constructor


  onChoiceClick = event => {
    const buttonValue = event.target.name
    this.setState({ choice: buttonValue });
  }

  onButtonClick = event => {
    const buttonValue = event.target.name
    console.log('0. onButtonClick - buttonValue: ', buttonValue)
    // console.log('1. onButtonClick - setConnectionExistsToFalse...')
    // this.setConnectionExistsToFalse() //first setConnectionExistsToFalse, to stop disconnect Yjs...
    console.log('2. onButtonClick - ...then setState to new showRoom...')
    this.setState({
      showRoom: buttonValue,
    })
  }

  setConnectionExistsToTrue() {
    console.log('calling setConnectionExistsToTrue...')
    this.setState({ connectionExists: true });
    // console.log('TextEditContainer - STATE NOW - this.state is: ', this.state)
  }

  setConnectionExistsToFalse() {
    console.log('calling setConnectionExistsToFalse...')
    this.setState({ connectionExists: false });
    // console.log('TextEditContainer - STATE NOW - this.state is: ', this.state)
  }


  render() {

    console.log('TextEditContainer - render - this.state is: ', this.state)
    return (
      <div className='TextEditContainer-style'>

        <h2>
          TextEditContainer
        </h2>

        <div>
          <QuillEditor
            showRoom={'room0'} //this is only prop that TextEdit needs!!!
            connectionExists={this.state.connectionExists}
          />
        </div>

      </div>
    );
  }
}

export default TextEditContainer;
