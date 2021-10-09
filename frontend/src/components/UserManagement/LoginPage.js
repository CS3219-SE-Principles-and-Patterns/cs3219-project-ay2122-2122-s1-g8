import React from "react";
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';

import LoginInput from "./LoginInput";
import LoginImage from '../../images/login.png'
import "./LoginPage.css";

function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-left">
        <img src={LoginImage} />
      </div>
      <div className="login-right">
        <h1>Login to start prepping now!</h1>
        <br/>
        <LoginInput />
        <br />
        <br />
        <h4>Don't have an account? Register here!</h4>
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
          <Link to='/register'>
            <Button variant="outlined">Create an account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;