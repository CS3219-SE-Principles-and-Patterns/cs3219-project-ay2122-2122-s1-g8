import React from 'react';
import Quill from "quill";
import "quill/dist/quill.snow.css";
const Y = require('yjs')


// YjsQuill plugins
require('y-memory')(Y)
require('y-array')(Y)
require('y-richtext')(Y)
require('y-websockets-client')(Y)

var io = Y['websockets-client'].io //need to get this.....


var link = 'http://127.0.0.1:3030' //when running textedit-app-yjs-websockets-server locally
// var link = 'http://localhost:5000' //when running `heroku local web`
// var link = process.env.REACT_APP_YJS_HEROKU_URL //this link is set in my .env file, which is hidden from github

var connection = null;

class YjsQuill extends React.Component {
  componentDidMount() {
    console.log('YjsQuill - componentDidMount - this.props is: ', this.props)
    console.log('YjsQuill - componentDidMount - this.props.showRoom is: ', this.props.showRoom)
    console.log('YjsQuill - componentDidMount - this.props.socket is: ', this.props.socket)
    connection = this.props.socket;
  }
  

  render() {
    var connection = this.props.socket;

    console.log('YjsQuill - render - this.props is: ', this.props)

    // var that = this; //setting 'this' to 'that' so scope of 'this' doesn't get lost in promise below

    console.log('YjsQuill -->>> connection in render is: ', connection)
    console.log('YjsQuill -->>> connection.connected in render is: ', connection.connected)
    console.log('YjsQuill -->>> connection.id in render is: ', connection.id)

    var connectionId = connection.id
    console.log('connectionId is: ', connectionId)

    if (this.props.connectionExists === false) {
      console.log('YjsQuill --->> this.props.connectionExists === false')
        // connection.destroy() //this works! server log shows 'user left', and updates to text don't sync on reconnect... (calling disconnect() instead of destroy() made updates still sync.)
        connection.disconnect()
        console.log('connection disconnected...')
        console.log('USER LEFT, connection DESTROYED.')
    } //end if statement

    //putting Y within a ternary operator, so it only gets rendered if connectionExists...
    if (this.props.connectionExists === true) {

      Y({
        db: {
          name: 'memory'
        },
        connector: {
          name: 'websockets-client', // use the websockets-client connector
          room: this.props.showRoom, // passing in room from props...
          socket: connection, // passing connection above as the socket...
          url: link // the connection endpoint (see y-websockets-server)
        },
        share: {
          richtext: 'Richtext' // y.share.richtext is of type Y.Richtext
        }
      }).then( (y) => {

        window.yquill = y
        console.log('window.yquill is ', window.yquill) // debug

        const toolbarOptions = [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["bold", "italic", "underline"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ align: [] }],
          ["image", "blockquote", "code-block"],
          ["clean"],
        ];

        window.quill = new Quill('#editor', {
        modules: {
          toolbar: toolbarOptions,
        },
        theme: 'snow',
        placeholder: "Write something awesome..."
        });

        console.log('window.yquill is ', window.quill) // debug
        y.share.richtext.bindQuill(window.quill)
      })
    }


    return (
      <div className="Yjs-style">
        <p>
          <span>
            YjsQuill: {this.props.showRoom}
          </span>
        </p>
      </div>
    );
  }
}

export default YjsQuill;
