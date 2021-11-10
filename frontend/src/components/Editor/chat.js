import React, { useEffect, useState, useRef } from "react";
import { colors, Paper } from "@material-ui/core";
import { TextInput } from "./TextInput.js";
import { MessageLeft, MessageRight } from "./message";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import LocalStorageService from "../../auth/services/LocalStorageService";
const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      width: "29vw",
      height: "45vh",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative",
      border: "1px solid silver",
    },
    paper2: {
      width: "29vw",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative",
    },
    container: {
      position: "absolute",
      width: "29vw",
    },
    messagesBody: {
      width: "calc( 100% - 20px )",
      margin: 10,
      overflowY: "scroll",
      height: "calc( 100% - 80px )",
    },
  })
);

function Chat(props) {
  const classes = useStyles();
  var socket = props.socket;
  const [messages, setMessages] = useState([]);
  const [ID, setID] = useState(props.user_id);
  const listMessages = messages.map((message1) => {
    if (message1.id != ID) {
      return (
        <MessageLeft
          key={message1.msgId}
          message={message1.text}
          displayName={message1.id}
        />
      );
    } else {
      return (
        <MessageRight
          key={message1.msgId}
          message={message1.text}
          displayName={message1.id}
        />
      );
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
        <TextInput socket={props.socket} id={ID} roomId={props.roomId} />
      </Paper>
    </div>
  );
}

export default Chat;
