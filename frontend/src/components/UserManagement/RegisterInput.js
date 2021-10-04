import React, { useState } from "react";
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import "./LoginPage.css";
import apis from '../../api/api'

const buttonTheme = createTheme({
  palette: {
    primary: {
      main: '#5b6efc'
    }
  }
});

function RegisterInput() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useHistory();

  const handleRegister = async () => {
    if (password != confirmPassword){
      alert("Please enter password correctly!");
      return;
    }
    const data = {
      username: username,
      email: email,
      password: password
    }
    await apis.registerAccount(data).then((res) => {
      console.log(res.data.message);
      history.push('login')
    }).catch(err => {
      console.log(err);
    })
  }

  const handleEmail = ({target}) => {
    const { value } = target;
    setEmail(value);
  }

  const handlePassword = ({target}) => {
    const { value } = target;
    setPassword(value);
  }

  const handleConfirmPassword = ({target}) => {
    const { value } = target;
    setConfirmPassword(value);
  }

  const handleUsername = ({target}) => {
    const { value } = target;
    setUsername(value);
  }

  return (
    <div style={{minWidth:"60%"}}>
      <div style={{textAlign:"center"}}>
        <FormControl noValidate autoComplete="off" justify='center' alignItems='center' fullWidth>
          <div>
          <TextField
            fullWidth 
            label="Email address"
            type="email"
            variant="outlined"
            padding="50"
            value={email || ''}
            onChange = {handleEmail}
          />
          </div>
          <br />
          <div>
          <TextField
            fullWidth 
            label="Password"
            type="password"
            variant="outlined"
            value={password || ''}
            onChange = {handlePassword}
          />
          </div>
          <br />
          <div>
          <TextField
            fullWidth 
            label="Confirm password"
            type="password"
            variant="outlined"
            value={confirmPassword || ''}
            onChange = {handleConfirmPassword}
          />
          </div>
          <br />
          <div>
          <TextField
            fullWidth 
            label="Username"
            type="Username"
            variant="outlined"
            value={username || ''}
            onChange = {handleUsername}
          />
          </div>
          <br></br>
          <br></br>
        </FormControl>
        <br></br>
        <br></br>
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
          <MuiThemeProvider theme={buttonTheme}>
            <Button color="primary" variant="contained" size = "large" onClick={handleRegister}>Register</Button>
          </MuiThemeProvider>
        </div>
      </div>
    </div>
  );
}

export default RegisterInput;