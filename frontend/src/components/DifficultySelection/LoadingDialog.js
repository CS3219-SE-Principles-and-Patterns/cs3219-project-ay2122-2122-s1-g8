import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import LoadingBar from "./LoadingBar";
import apis from '../../api/api'

export default function LoadingDialog(props) {

  const timer = 5;
  const [open, setOpen] = useState(false);
  const [seconds, setSeconds] = useState(timer);
  const [isTimeout, setIsTimeout] = useState(false);
  const [isDecreasing, setIsDecreasing] = useState(false);
  const history = useHistory();

  const handleClose = () => {
    setOpen(false);
  };

  const handleAgree = () => {
    setOpen(false);
    //setSeconds(timer);
    setIsTimeout(false);
    setIsDecreasing(false);
  }

  const handleDiffSelect = async () => {
    setIsTimeout(false);
    setOpen(true);
    setIsDecreasing(true);
    setSeconds(timer);
    const data = {
      username: localStorage['user_id'],
      questionDifficulty: props.difficulty
    }

    console.log(data)

    await apis.updateQuestionType(data).then((res) => {
      console.log(res)
      //history.push("editor-page")
    }).catch(err=> {
      console.log(err);
    })
  }

  useEffect(() => {
    if (seconds > 0 && isDecreasing) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setIsTimeout(true);
      setIsDecreasing(false);
    }
  }, [isDecreasing, seconds]);

  return (
    <div>
      <Button variant="outlined" color="secondary" onClick={handleDiffSelect}>
        Let's go!
      </Button>

      {!isTimeout && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick="false"
        >
          <DialogTitle id="alert-dialog-title">
            {"Give us a moment while we search for another online user!"}
            {seconds}
          </DialogTitle>
          <br/>
          <DialogContent>
            <LoadingBar/>
          </DialogContent>
        </Dialog>
      )}

      {isTimeout && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick="false"
        >
          <DialogTitle id="alert-dialog-title">
            {"No online users"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              It seems like there are no other online users at the moment. Please try again later!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAgree} autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      )}

    </div>
  );
}
