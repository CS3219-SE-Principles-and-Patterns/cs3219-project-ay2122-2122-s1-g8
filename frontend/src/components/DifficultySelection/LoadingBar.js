import React, {useState, useEffect} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 15,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
  },
}))(LinearProgress);

const TextTypography = withStyles({
  root: {
    color: "#2e28d4",
    textAlign: "center"
  }
})(Typography);

const useStyles = makeStyles({
  root: {
    width: '100%',
    minWidth: "500px"
  },
});

export default function LoadingBar() {

  const classes = useStyles();
  const [seconds, setSeconds] = useState(30);
  const [isTimeout, setIsTimeout] = useState(false);

  /*useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setIsTimeout(true);
    }
  });*/ //no []

  return (
    <div className={classes.root}>

      <BorderLinearProgress />

      <TextTypography variant="caption" component="div" color="textSecondary">
        Searching for peers...
      </TextTypography>
      
  </div>
  );
}