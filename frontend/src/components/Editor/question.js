import React, { useMemo, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import apis from "../../api/api";

const useStyles = makeStyles({
  root: {
    minwidth: "100%",
    height: "100%",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
  },
  difficulty: {
    fontSize: 15,
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    width: 30,
    height: 20,
    padding: "0 30px",
    marginBottom: 12,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function Question(props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [difficulty, setDifficulty] = useState("");
  console.log(props.roomID);
  useEffect(() => {
    apis
      .fetchQuestion(props.roomID)
      .then((res) => {
        console.log(res.data);
        // var question = JSON.parse(res.data.question);
        // console.log(res.data);
        setTitle(res.data.question.questionStatement);
        setDifficulty(res.data.question.difficulty);
      })
      .catch((err) => {
        console.log("something wrong");
        console.log(err);
      });
  }, []);

  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Box className={classes.difficulty}>{difficulty}</Box>
        <Typography className={classes.title} variant="h1" color="textPrimary">
          {title ? title : "Retrieving question..."}
        </Typography>
        <Typography variant="body2" component="p">
          {body}
          <br />
        </Typography>
      </CardContent>
    </Card>
  );
}
