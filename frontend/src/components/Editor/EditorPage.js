import React, { Component } from "react";
import { withRouter } from "react-router";
import RichTextEditor from "./RichTextEditor";
import io from "socket.io-client";
import "./editorpage.css";
import Question from "./question";
import Button from "@material-ui/core/Button";
import Chat from "./chat";
import NavBar from "./../NavBar/NavBar";
import LocalStorageService from "../../auth/services/LocalStorageService";
class EditorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //socket: io.connect("http://10.27.153.189:3011", { reconnect: true }),
      room_id: props.match.params.id,
      socket: io.connect("http://192.168.0.103:3011", { reconnect: true }),
      user_id: LocalStorageService.getUserID(),
    };
    console.log(this.state.socket);
    console.log("Room id:", this.state.room_id);
    this.handlefinish = this.handlefinish.bind(this);
  }
  handlefinish() {
    this.props.history.push({
      pathname: "/",
    });
  }
  render() {
    return (
      <div className="container">
        <div className="top">
          <NavBar />
        </div>
        <div className="bottom">
          <div className="split left">
            <div className="question">
              <Question />
            </div>
            <div className="chat">
              <Chat socket={this.state.socket} user_id={this.state.user_id} />
            </div>
          </div>
          <div className="split right">
            <div className="editor-component">
              <RichTextEditor socket={this.state.socket} />
            </div>
            <div className="finish">
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handlefinish}
              >
                Finish
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditorPage;
