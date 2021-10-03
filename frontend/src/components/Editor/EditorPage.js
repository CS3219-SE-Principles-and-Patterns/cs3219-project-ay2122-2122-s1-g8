import React, { Component } from "react";
import RichTextEditor from "./RichTextEditor";
import io from "socket.io-client";
import "./editorpage.css";
import Question from "./question";
import Chat from "./chat";

class EditorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //socket: io.connect("http://10.27.153.189:3011", { reconnect: true }),
      socket: io.connect("http://192.168.0.103:3011", { reconnect: true }),
    };
    console.log(this.state.socket);
  }
  render() {
    return (
      <div>
        <div className="split left">
          <div className="question">
            <Question />
          </div>
          <div className="chat">
            <Chat socket={this.state.socket} />
          </div>
        </div>
        <div className="split right">
          <div className="editor-component">
            <RichTextEditor socket={this.state.socket} />
          </div>
        </div>
      </div>
    );
  }
}

export default EditorPage;
