import React, { Component, useMemo, useState, useEffect } from "react";
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
import TextEditor from "./TextEditor";
import "./styles.css";
import apis from "../../api/api";

class EditorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      room_id: props.match.params.id,
      // socket: io.connect("http://127.0.0.1:3030", { reconnect: true }),
      socket: io.connect("https://peerprep.herokuapp.com", { reconnect: true }),
      user_id: LocalStorageService.getUserID(),
      question_id: "HELLO QID",
      title: "Retrieving Question...",
      difficulty: "",
    };
    this.handlenextquestion = this.handlenextquestion.bind(this);
    this.handlefinish = this.handlefinish.bind(this);
    this.state.socket.emit(
      "show credential",
      this.state.room_id,
      this.state.user_id
    );
    this.state.socket.on("credential accepted", (msg) => {
      this.setState({ error: false });
    });
    this.state.socket.on("credential invalid", (msg) => {
      this.setState({ error: true });
    });
    this.state.socket.on("change question", (msg) => {
      const data = {
        id: msg,
        authorization: "Bearer " + localStorage.getItem("access_token"),
      };
      apis
        .getQuestion(data)
        .then((res) => {
          const { _id, questionStatement, difficulty } = res.data.question;
          this.setState({
            ...this.state,
            question_id: _id,
            title: questionStatement,
            difficulty,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
    this.state.socket.on("leave room", (msg) => {
      this.setState({ error: true });
      this.props.history.push({
        pathname: "/",
      });
    });
    const data = {
      id: this.state.room_id,
      authorization: "Bearer " + localStorage.getItem("access_token"),
    };
    apis
      .fetchQuestion(data)
      .then((res) => {
        const { _id, questionStatement, difficulty } = res.data.question;
        this.setState({
          ...this.state,
          question_id: _id,
          title: questionStatement,
          difficulty,
        });
      })
      .catch((err) => {
        console.log(err);
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
  handlenextquestion() {
    const data = {
      question_id: this.state.question_id,
      room_id: this.state.room_id,
      authorization: "Bearer " + localStorage.getItem("access_token"),
    };

    apis
      .getNextQuestion(data)
      .then((res) => {
        const { _id, questionStatement, difficulty } = res.data.question;
        this.setState({
          ...this.state,
          question_id: _id,
          title: questionStatement,
          difficulty,
        });
        this.state.socket.emit(
          "change question",
          this.state.room_id,
          this.state.question_id
        );
      })
      .catch((err) => {
        console.log(err);
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
              <Question
                roomID={this.state.room_id}
                questionID={this.state.question_id}
                title={this.state.title}
                difficulty={this.state.difficulty}
              />
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
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  this.handlenextquestion();
                }}
              >
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
