import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import LoadingBar from "./LoadingBar";
import apis from "../../api/api";
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
    setIsTimeout(false);
    setIsDecreasing(false);
  };

  const handleDiffSelect = async () => {
    setIsTimeout(false);
    setOpen(true);
    setIsDecreasing(true);
    setSeconds(timer);

    const questionData = {
      username: LocalStorageService.getUserID(),
      questionDifficulty: props.difficulty,
    };

    const matchData = {
      username: LocalStorageService.getUserID(),
      difficulty: props.difficulty,
      authorization: 'Bearer ' + localStorage.getItem("access_token"),
    };

    await apis
      .updateQuestionType(questionData)
      .then(async (res) => {
        await apis
          .newMatch(matchData)
          .then((res) => {
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
                const matchData = {
                  username: LocalStorageService.getUserID(),
                  difficulty: props.difficulty,
                  authorization: 'Bearer ' + localStorage.getItem("access_token"),
                };
                await apis
                .newMatch(matchData)
                .then((res) => {
                }).catch((err) => {
                  console.log(err);
                });
              })
            } else {
              console.log(err)
            }
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(async () => {
    if (seconds > 0 && isDecreasing) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setIsTimeout(true);
      setIsDecreasing(false);

      const matchData = {
        username: LocalStorageService.getUserID(),
        difficulty: props.difficulty,
        authorization: 'Bearer ' + localStorage.getItem("access_token"),
      };

      if (isDecreasing) {
        await apis
          .dropMatch(matchData)
          .then((res) => {
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
                const matchData = {
                  username: LocalStorageService.getUserID(),
                  difficulty: props.difficulty,
                  authorization: 'Bearer ' + localStorage.getItem("access_token"),
                };
                await apis
                .dropMatch(matchData)
                .then((res) => {
                }).catch((err) => {
                  console.log(err);
                });
              })
            } else {
              console.log(err)
            }
          });
      }
    }
  }, [isDecreasing, seconds]);

  useEffect(async () => {
    if (seconds > 0 && seconds % 5 === 0) {
      const matchData = {
        username: LocalStorageService.getUserID(),
        difficulty: props.difficulty,
        authorization: 'Bearer ' + localStorage.getItem("access_token"),
      };

      if (isDecreasing) {
        await apis
          .matchStatus(matchData)
          .then(async (res) => {
            if (res.data.roomId) {
              const roomId = res.data.roomId;
              history.push("room/" + roomId);
            }
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
                const matchData = {
                  username: LocalStorageService.getUserID(),
                  difficulty: props.difficulty,
                  authorization: 'Bearer ' + localStorage.getItem("access_token"),
                };
                await apis
                .matchStatus(matchData)
                .then(async (res) => {
                  if (res.data.roomId) {
                    const roomId = res.data.roomId;
                    history.push("room/" + roomId);
                  }
                }).catch((err) => {
                  console.log(err);
                });
              })
            } else {
              console.log(err)
            }
          });
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
          onClose={(event, reason) => reason !== "backdropClick"}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Give us a moment while we search for another online user!"}
          </DialogTitle>
          <br />
          <DialogContent>
            <LoadingBar timer={seconds} />
          </DialogContent>
        </Dialog>
      )}

      {isTimeout && (
        <Dialog
          open={open}
          onClose={(event, reason) => reason !== "backdropClick"}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"No online users"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              It seems like there are no other online users at the moment.
              Please try again later!
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
