import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapForm: {
      display: "flex",
      justifyContent: "center",
      width: "95%",
      margin: `${theme.spacing(0)} auto`,
    },
    wrapText: {
      width: "100%",
    },
    button: {
    },
  })
);

export const TextInput = (props) => {
  const classes = useStyles();
  const [text, setText] = useState("");
  function handleInputChange(event) {
    setText(event.target.value);
  }
  function sendChatMessage(socket) {
    var payload = { id: props.id, text: text };
    props.socket.emit("chat message", props.roomId, payload);
    setText("");

    var payload = { id: props.id, text: text };
    setText("");
  }
  return (
    <div style={{width: "95%"}}>
      <form className={classes.wrapForm} noValidate autoComplete="off">
        <TextField
          id="standard-text"
          label="Type a message..."
          className={classes.wrapText}
          value={text}
          multiline
          onChange={handleInputChange}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={sendChatMessage}
        >
          <SendIcon />
        </Button>
      </form>
    </div>
  );
};
