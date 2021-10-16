import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { deepOrange } from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    messageRow: {
      display: "flex",
    },
    messageRowRight: {
      display: "flex",
      justifyContent: "flex-end",
    },
    messageBlue: {
      position: "relative",
      marginLeft: "20px",
      marginBottom: "10px",
      padding: "10px",
      backgroundColor: "#AEE6E6 ",
      width: "60%",
      color: "#7d6c4f",
      //height: "50px",
      textAlign: "left",
      font: "400 .9em 'Open Sans', sans-serif",
      border: "1px solid #AEE6E6 ",
      borderRadius: "10px",
      "&:after": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "15px solid #AEE6E6 ",
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        top: "0",
        left: "-15px",
      },
      "&:before": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "17px solid #AEE6E6 ",
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        top: "-1px",
        left: "-17px",
      },
    },
    messageOrange: {
      position: "relative",
      marginRight: "20px",
      marginBottom: "10px",
      padding: "10px",
      backgroundColor: "#FEA82F",
      color: "#7d6c4f",
      width: "60%",
      //height: "50px",
      textAlign: "left",
      font: "400 .9em 'Open Sans', sans-serif",
      border: "1px solid #FEA82F",
      borderRadius: "10px",
      "&:after": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "15px solid #FEA82F",
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        top: "0",
        right: "-15px",
      },
      "&:before": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "17px solid #FEA82F",
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        top: "-1px",
        right: "-17px",
      },
    },

    messageContent: {
      padding: 0,
      margin: 0,
    },
    messageTimeStampRight: {
      position: "absolute",
      fontSize: ".85em",
      fontWeight: "300",
      marginTop: "10px",
      bottom: "-3px",
      right: "5px",
    },

    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    avatarNothing: {
      color: "transparent",
      backgroundColor: "transparent",
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    displayName: {
      marginLeft: "20px",
    },
  })
);

export const MessageLeft = (props) => {
  const message = props.message ? props.message : "no message";
  const displayName = props.displayName ? props.displayName : "anon";
  const classes = useStyles();
  return (
    <div className={classes.messageRow}>
      <div>
        <div className={classes.displayName}>{displayName}</div>
        <div className={classes.messageBlue}>
          <div>
            <p
              style={{ whiteSpace: "pre-line" }}
              className={classes.messageContent}
            >
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
//avatarが右にあるメッセージ（自分）
export const MessageRight = (props) => {
  const classes = useStyles();
  const message = props.message ? props.message : "no message";
  return (
    <div className={classes.messageRowRight}>
      <div className={classes.messageOrange}>
        <p
          style={{ whiteSpace: "pre-line" }}
          className={classes.messageContent}
        >
          {message}
        </p>
      </div>
    </div>
  );
};
