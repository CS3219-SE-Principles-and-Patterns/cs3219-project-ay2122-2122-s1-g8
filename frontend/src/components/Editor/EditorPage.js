import React, { Component } from "react";
import { withRouter } from "react-router";
import io from "socket.io-client";
import "./editorpage.css";
import Question from "./question";
import Button from "@material-ui/core/Button";
import Chat from "./chat";
import NavBar from "./../NavBar/NavBar";
import LocalStorageService from "../../auth/services/LocalStorageService";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextEditor from "./TextEditor";
import "./styles.css";

class EditorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      room_id: props.match.params.id,
      // socket: io.connect("http://192.168.0.103:3030", { reconnect: true }),
      // socket: io.connect("http://127.0.0.1:3030", { reconnect: true }),
      socket: io.connect("https://peerprep.herokuapp.com", { reconnect: true }),
      user_id: LocalStorageService.getUserID(),
    };
    console.log(this.state.socket);
    console.log("Room id:", this.state.room_id);
    this.handlefinish = this.handlefinish.bind(this);
    this.state.socket.emit(
      "show credential",
      this.state.room_id,
      this.state.user_id
    );
    this.state.socket.on("credential accepted", (msg) => {
      this.setState({ error: false });
      console.log("credential accepted");
    });
    this.state.socket.on("credential invalid", (msg) => {
      this.setState({ error: true });
      console.log("credential invalid");
    });
    this.state.socket.on("leave room", (msg) => {
      this.setState({ error: true });
      this.props.history.push({
        pathname: "/",
      });
    });
  }
  handleClose = () => {
    this.setState({ error: false });
  };
  handlefinish() {
    this.state.socket.emit("leave room", this.state.room_id);
    this.props.history.push({
      pathname: "/",
    });
  }
  render() {
    return (
      <div className="container">
        <Dialog
          open={this.state.error}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Room credentials error. Unable to enter a room.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
        <div className="top">
          <NavBar />
        </div>
        <div className="bottom">
          <div className="split left">
            <div className="question">
              <Question roomID={this.state.room_id} />
            </div>
            <div className="chat">
              <Chat
                socket={this.state.socket}
                user_id={this.state.user_id}
                roomId={this.state.room_id}
              />
            </div>
          </div>
          <div className="split right">
            <div className="editor-component">
              <TextEditor
                socket={this.state.socket}
                roomId={this.state.room_id}
              />
            </div>
            <div className="next">
              <Button variant="contained" color="secondary">
                Next
              </Button>
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
