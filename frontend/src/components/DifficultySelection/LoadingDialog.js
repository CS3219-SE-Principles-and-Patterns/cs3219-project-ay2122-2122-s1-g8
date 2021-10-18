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
import LocalStorageService from "../../auth/services/LocalStorageService";

export default function LoadingDialog(props) {

  const timer = 30;
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

    const questionData = {
      username: LocalStorageService.getUserID(),
      questionDifficulty: props.difficulty
    }    
    
    const matchData = {
      username: LocalStorageService.getUserID(),
      difficulty: props.difficulty
    }

    await apis.updateQuestionType(questionData).then(async (res) => {
      console.log(res.data)
      await apis.newMatch(matchData).then((res) => {
        console.log(res.data);
      }).catch(err => {
        console.log(err);
      })
    }).catch(err=> {
      console.log(err);
    })
  }

  useEffect(async () => {
    if (seconds > 0 && isDecreasing) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setIsTimeout(true);
      setIsDecreasing(false);

      const matchData = {
        username: LocalStorageService.getUserID(),
        difficulty: props.difficulty
      }

      if (isDecreasing) {
        await apis.dropMatch(matchData).then((res) => {
          console.log(res.data);
        }).catch(err => {
          console.log(err);
        })
      }

    }
  }, [isDecreasing, seconds]);

  useEffect(async () => {
    if (seconds > 0 && seconds % 5 === 0) {

      const matchData = {
        username: LocalStorageService.getUserID(),
        difficulty: props.difficulty
      }

      if (isDecreasing) {
        await apis.matchStatus(matchData).then(async (res) => {
          console.log(res.data);
          if (res.data.roomId) {
            const roomId = res.data.roomId;
            history.push("room/" + roomId);
          } 
        }).catch(err => {
          console.log(err);
        })
      }

    } 
  }, [seconds]);

  return (
    <div>
      <Button variant="outlined" color="secondary" onClick={handleDiffSelect}>
        Let's go!
      </Button>

      {!isTimeout && (
        <Dialog
          open={open}
          onClose={(event, reason) => reason !== 'backdropClick'}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
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
          onClose={(event, reason) => reason !== 'backdropClick'}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
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
