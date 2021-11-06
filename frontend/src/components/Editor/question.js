import React, { useMemo, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import apis from "../../api/api";
import LocalStorageService from "../../auth/services/LocalStorageService";

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
    // background-color: #485461;
    // background-image: linear-gradient(315deg, #485461 0%, #28313b 74%);
    background: "linear-gradient(315deg, #485461 0%, #28313b 74%)",
    border: 0,
    borderRadius: 3,
    color: "white",
    width: "30%",
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

  useEffect(()=>{
    console.log("rerender question");
    setTitle(props.title);
    setDifficulty(props.difficulty);
  },[props])
 
  const data = {
    id: props.roomID,
    authorization: "Bearer " + localStorage.getItem("access_token"),
  };
  useEffect(() => {
    apis
      .fetchQuestion(data)
      .then((res) => {
        console.log(res.data);
        // var question = JSON.parse(res.data.question);
        // console.log(res.data);
        setTitle(res.data.question.questionStatement);
        setDifficulty(res.data.question.difficulty);
      })
      .catch(async (err) => {
        if (err.response.status === 403) {
          const refreshToken = localStorage.getItem("refresh_token");
          const payload = {
            token: refreshToken,
          }
          await apis.refreshToken(payload).then(async (res) => {
            const accessToken = (res.data.accessToken);
            LocalStorageService.setToken({token: accessToken});
            const data = {
              id: props.roomID,
              authorization: "Bearer " + localStorage.getItem("access_token"),
            };
            await apis
            .fetchQuestion(data)
            .then((res) => {
              console.log(res.data);
              // var question = JSON.parse(res.data.question);
              // console.log(res.data);
              setTitle(res.data.question.questionStatement);
              setDifficulty(res.data.question.difficulty);
            }).catch((err) => {
              console.log(err);
            });
          })
        } else {
          console.log(err)
        }
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