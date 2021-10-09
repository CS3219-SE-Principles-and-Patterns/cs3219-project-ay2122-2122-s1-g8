import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import LoadingBar from "./LoadingBar";

export default function AlertDialog() {

  const timer = 10;
  const [open, setOpen] = useState(false);
  const [seconds, setSeconds] = useState(timer);
  const [isTimeout, setIsTimeout] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAgree = () => {
    setOpen(false);
    setSeconds(timer);
    setIsTimeout(false);
  }

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setIsTimeout(true);
    }
  }, [open, seconds]);

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button>

      {!isTimeout && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          //onBackdropClick="false"
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
          //onBackdropClick="false"
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
