import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import "./LoginPage.css";
import apis from '../../api/api'
import LocalStorageService from "../../auth/services/LocalStorageService";

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

  const [ isEmailError, setisEmailError ] = useState(false)
  const [ isPasswordError, setisPasswordError ] = useState(false)

  const [ emailHelperText, setEmailHelperText ] = useState("")
  const [ passwordHelperText, setPasswordHelperText ] = useState("")

  const [ invalidEmailPassword, setInvalidEmailPassword ] = useState(false)

  const history = useHistory();

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    const data = {
      username: email,
      password: password
    }
    await apis.loginAccount(data).then((res) => {
      if (res.data.message == 'Login successfully!'){
        console.log(res.data)
        LocalStorageService.setToken(res.data);
        LocalStorageService.setUserID(res.data);
        history.push('/');
      }else if(res.data.message == 'Wrong password!') {
        setisEmailError(true)
        setisPasswordError(true)
        setPasswordHelperText("Invalid email or password.")
        setEmailHelperText("Invalid email or password.")
        //setPasswordHelperText(res.data.message);
        //setisPasswordError(true)
      }else{
        //setEmailHelperText(res.data.message);
        //setisEmailError(true)
        setisEmailError(true)
        setisPasswordError(true)
        setPasswordHelperText("Invalid email or password.")
        setEmailHelperText("Invalid email or password.")
      }
    }).catch(err=> {
      console.log(err);
      setInvalidEmailPassword(true);
    })
  }

  function validateForm() {
    setisEmailError(false)
    setEmailHelperText("")
    setisPasswordError(false)
    setPasswordHelperText("")
    setInvalidEmailPassword(false)

    var validatedSuccess = true

    if (email === "" ) {
      setisEmailError(true)
      setEmailHelperText("Invalid email.")
      validatedSuccess = false
    }
    if (password === "" ) {
      setisPasswordError(true)
      setPasswordHelperText("Password cannot be empty.")
      validatedSuccess = false
    }
    return validatedSuccess
  }

  const handleEmail = ({target}) => {
    const { value } = target;
    setEmail(value);
  }

  const handlePassword = ({target}) => {
    const { value } = target;
    setPassword(value);
  }

  useEffect(() => {
    if(invalidEmailPassword) {
      setisEmailError(true)
      setisPasswordError(true)
      setPasswordHelperText("Invalid email or password.")
    }
  }, [invalidEmailPassword])

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
            error={ isEmailError }
            helperText={ emailHelperText }
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
            error={ isPasswordError }
            helperText={ passwordHelperText }
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