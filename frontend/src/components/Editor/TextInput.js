import { React, useState } from "react";
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
      //margin: theme.spacing(1),
    },
  })
);

export const TextInput = (props) => {
  const classes = useStyles();
  const [text, setText] = useState("");
  function handleInputChange(event) {
    // console.log(event.target.value);
    setText(event.target.value);
  }
  function sendChatMessage(socket) {
    var payload = { id: props.id, text: text };
    console.log("user ", props.id, "sending message");
    props.socket.emit("chat message", (props.roomId, payload));
    setText("");

    var payload = { id: props.id, text: text };
    console.log("user ", props.id, "sending message");
    // props.socket.emit("show credential", "47e1fc44e2b74de50d19", "oongjiexiang");  // JX to Chris: uncomment the code above and only leave this line to test 'show credential' event
    setText("");
  }
  return (
    <div>
      <form className={classes.wrapForm} noValidate autoComplete="off">
        <TextField
          id="standard-text"
          label="Type a messsage..."
          className={classes.wrapText}
          value={text}
          multiline
          onChange={handleInputChange}
          //margin="normal"
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
