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

export default function LoadingBar(props) {

  const classes = useStyles();
  const [seconds, setSeconds] = useState(props.timer);
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    setSeconds(props.timer)
  });

  return (
    <div className={classes.root}>

      <BorderLinearProgress />

      <TextTypography variant="caption" component="div" color="textSecondary">
        Searching for peers...
      </TextTypography>

      <TextTypography variant="caption" component="div" color="textSecondary">
        Time to connect: {seconds} seconds
      </TextTypography>
      
  </div>
  );
}