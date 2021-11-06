import React from 'react';

import YjsQuill from './YjsQuill';

class QuillEditor extends React.Component {

  componentDidMount() {
    console.warn('1. QuillEditor - componentDidMount...')
  } //componentDidMount
  
  render() {
    console.warn('0. QuillEditor - render...')
    return (
      <div className='TextEdit-style'>

        <YjsQuill
          showRoom={this.props.showRoom} //this is only prop that TextEdit needs!!!
          connectionExists={this.props.connectionExists}
          socket={this.props.socket}
        />

        {
          (this.props.connectionExists === true) ?
          /* <!-- Create the editor container --> */
          <div id="QuillEditor-container">
            <div id="editor">
              <p>The room will finish setting up soon!</p>
            </div>
          </div>
          :
          <div>
            LOADING...
          </div>
        }

      </div>
    )
  }
}

export default QuillEditor;
