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

  const [ isUsernameError, setisUsernameError ] = useState(false)
  const [ isPasswordError, setisPasswordError ] = useState(false)
  const [ isEmailError, setisEmailError ] = useState(false)

  const [ usernameHelperText, setUsernameHelperText ] = useState("")
  const [ passwordHelperText, setPasswordHelperText ] = useState("")
  const [ emailHelperText, setEmailHelperText ] = useState("")

  const history = useHistory();

  const handleRegister = async () => {
    if (!validateForm()){
      return;
    }
    const data = {
      username: username,
      email: email,
      password: password
    }
    await apis.registerAccount(data).then((res) => {
      console.log(res);
      if (res.data.message == "Successful registration!"){
        history.push('login')
      }else if(res.data.message == "Email exists!"){
        setisEmailError(true)
        setEmailHelperText("Email is already taken.")
      }else{
        setisUsernameError(true)
        setUsernameHelperText("Username is already taken.")
      }
    }).catch(err => {
      console.log(err);
      setisEmailError(true);
    })
  }

  function validateForm() {
    setisUsernameError(false)
    setUsernameHelperText("")
    setisPasswordError(false)
    setPasswordHelperText("")
    setisEmailError(false)
    setEmailHelperText("")
    
    var validatedSuccess = true
    
    if (username === "") {
      setisUsernameError(true)
      validatedSuccess = false
      setUsernameHelperText("Username cannot be empty.")
    }
    if (password === "") {
      setisPasswordError(true)
      validatedSuccess = false
      setPasswordHelperText("Password cannot be empty.")
    }
    if (password != confirmPassword) {
      setisPasswordError(true)
      validatedSuccess = false
      setPasswordHelperText("The passwords do not match.")
    }
    if (email === "") {
      setisEmailError(true)
      validatedSuccess = false
      setEmailHelperText("Email cannot be empty.")
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
            label="Username"
            type="Username"
            variant="outlined"
            value={username || ''}
            onChange = {handleUsername}
            error={ isUsernameError }
            helperText={ usernameHelperText }
          />
          </div>
          <br />
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
          <br />
          <div>
          <TextField
            fullWidth 
            label="Confirm password"
            type="password"
            variant="outlined"
            value={confirmPassword || ''}
            onChange = {handleConfirmPassword}
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
            <Button color="primary" variant="contained" size = "large" onClick={handleRegister}>Register</Button>
          </MuiThemeProvider>
        </div>
      </div>
    </div>
  );
}

export default RegisterInput;