import React, { useEffect, useState, useRef } from "react";
import { colors, Paper } from "@material-ui/core";
import { TextInput } from "./TextInput.js";
import { MessageLeft, MessageRight } from "./message";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      background: "#F9F3DF",
      width: "30vw",
      height: "30vh",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative",
      border: "1px solid #f4d19b;",
    },
    paper2: {
      background: "#F9F3DF",
      width: "30vw",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative",
      //   border: "3px solid red",
    },
    container: {
      position: "absolute",
      //   border: "3px solid red",
      bottom: 20,
      left: 20,
      width: "30vw",
    },
    messagesBody: {
      width: "calc( 100% - 20px )",
      margin: 10,
      overflowY: "scroll",
      height: "calc( 100% - 80px )",
      background: "#FDF6F0",
    },
  })
);

function Chat(props) {
  const classes = useStyles();
  var socket = props.socket;
  const [messages, setMessages] = useState([]);
  const [ID, setID] = useState(0);
  const listMessages = messages.map((message1) => {
    if (message1.id != ID) {
      return <MessageLeft message={message1.text} displayName={message1.id} />;
    } else {
      return <MessageRight message={message1.text} displayName={message1.id} />;
    }
  });
  const messageRef = useRef(messages);
  // this effect fires every time count is changed
  useEffect(() => {
    messageRef.current = messages;
  }, [messages]);
  useEffect(() => {
    socket.on("chat message", (msg) => {
      var data = msg;
      addMessage(data);
    });
    socket.on("initialize chat", (msg) => {
      console.log("User ID", msg);
      setID(msg);
    });
  }, []);
  function addMessage(data) {
    const newMessages = [
      // copy the current users state
      ...messageRef.current,
      data,
    ];
    setMessages(newMessages);
  }
  return (
    <div className={classes.container}>
      <Paper className={classes.paper} zDepth={2}>
        <Paper id="style-1" className={classes.messagesBody}>
          {listMessages}
        </Paper>
        <TextInput socket={props.socket} id={ID} />
      </Paper>
    </div>
  );
}

export default Chat;
