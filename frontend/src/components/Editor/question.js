import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 35,
    marginBottom: 20,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function Question() {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} variant="h1" color="textPrimary">
          Word of the Day
        </Typography>
        <Typography variant="body2" component="p">
          This text is styled with some of the text formatting properties. The
          heading uses the text-align, text-transform, and color properties. The
          paragraph is indented, aligned, and the space between characters is
          specified. The underline is removed from this colored "Try it
          Yourself" link.
          <br />
        </Typography>
      </CardContent>
    </Card>
  );
}
