import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import LoadingDialog from "./LoadingDialog"
import DifficultyImage from '../../images/rsz_test.png'
import EasyImage from "../../images/easy.png";
import MediumImage from "../../images/medium.png";
import HardImage from "../../images/hard.png";
import apis from '../../api/api'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 30,
    fontFamily: "Gabriola",
    color: "#158f32",
    fontWeight: "Bold"
  },
  pos: {
    marginBottom: 12,
  },
  button : {
    vertical: 'top',
    horizontal: 'right',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default function DifficultyCard(props) {
  const classes = useStyles();


  const difficulty = props.difficulty;
  const description = {
      "Easy": "Choose this option if you have just started practising for technical interviews and are not yet comfortable solving questions!",
      "Medium": "Choose this option if you have some experience solving technical problems for interviews but would still like more practice!",
      "Hard": "Choose this option if you are used to technical questions and want to challenge yourself with harder questions!"
  }
  const desc = description[difficulty];

  return (
    <Card className={classes.root} style={{textAlign: "center", maxWidth: 5}} raised = "true" >
      <CardContent>
        <Typography
          className={classes.title}
          color="textPrimary"
          gutterBottom
        >
          {difficulty}
        </Typography>
        {difficulty === "Easy" &&
          <img src={EasyImage} />
        }
        {difficulty === "Medium" &&
          <img src={MediumImage} />
        }
        {difficulty === "Hard" &&
          <img src={HardImage} />
        }
        <Typography variant="body2" component="p" style={{padding: 10, textAlign: "center"}} >
          {desc}
          <br />
          <br />
        </Typography>
      </CardContent>
      <CardActions style = {{justifyContent: "center"}}>
        <div>
          {/*<Button variant="outlined" color="secondary" onClick = {handleDiffSelect}>Let's go!</Button>*/}
          <LoadingDialog difficulty = {difficulty}/>
        </div>
      </CardActions>
      <br />
    </Card>
  );
}
