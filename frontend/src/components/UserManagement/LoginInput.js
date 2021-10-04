import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
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

function LoginInput() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleLogin = async () => {
    const data = {
      email: email,
      password: password
    }
    await apis.loginAccount(data).then((res) => {
      console.log(res.data.message);
      history.push('/');
    }).catch(err=> {
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
          <br></br>
          <br></br>
        </FormControl>
        <br></br>
        <br></br>
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
          <MuiThemeProvider theme={buttonTheme}>
            <Button color="primary" variant="contained"  size = "large" onClick={handleLogin}>Login</Button>
          </MuiThemeProvider>
        </div>
      </div>
    </div>
  );
}

export default LoginInput;