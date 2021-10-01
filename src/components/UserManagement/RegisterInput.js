import React, { useState } from "react";
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import "./LoginPage.css";
import axios from "axios"
const api = axios.create({
  baseURL: 'http://localhost:3030/api'
})

function RegisterInput() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password != confirmPassword){
      alert("Please enter password correctly!");
      return;
    }
    api.post('/register', {
      username: username,
      email: email,
      password: password
    }).then(function (response) {
      alert(response.data.message);
    }).catch(function (error) {
      alert("Register unsuccessfully!");
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
            type="Confirm password"
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
          <Button color="primary" variant="contained" onClick={handleRegister}>Register</Button>
        </div>
      </div>
    </div>
  );
}

export default RegisterInput;