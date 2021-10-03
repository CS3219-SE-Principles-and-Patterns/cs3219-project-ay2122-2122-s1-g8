import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import DifficultyImage from '../../images/rsz_test.png'

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
    fontSize: 14,
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
      "Easy": "easy description asdljsadlkshadl ksadjlsadkldsajk lasdfafsasdaasd",
      "Medium": "medium description asdljsadlkshadl ksadjlsadkldsajk lasdfafsasdaasd",
      "Hard": "hard description asdljsadlkshadl ksadjlsadkldsajk lasdfafsasdaasd"
  }
  const desc = description[difficulty];

  return (
    <Card className={classes.root} style={{textAlign: "center", maxWidth: 5}}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textPrimary"
          gutterBottom
        >
          {difficulty}
        </Typography>
        <img src={DifficultyImage} />
        <Typography variant="body2" component="p">
          {desc}
          <br />
          <br />
        </Typography>
      </CardContent>
      <CardActions style = {{justifyContent: "center"}}>
        <div>
          <Button variant="outlined" color="secondary">Let's go!</Button>
        </div>
      </CardActions>
      <br />
    </Card>
  );
}
