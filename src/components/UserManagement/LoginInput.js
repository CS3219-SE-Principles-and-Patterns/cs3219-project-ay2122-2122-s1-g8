import React, { useState } from "react";
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import "./LoginPage.css";
import axios from "axios"
const api = axios.create({
  baseURL: 'http://localhost:3030/api'
})

function LoginInput() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () =>{
    api.post('/login', {
      username: email,
      password: password
    }).then(function (response) {
      alert(response.data.message)
    }).catch(function (error) {
      console.log(error);
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
          <Button color="primary" variant="contained" onClick={handleLogin}>Login</Button>
        </div>
      </div>
    </div>
  );
}

export default LoginInput;