import React from "react";
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';

import RegisterInput from "./RegisterInput";
import LoginImage from '../../images/login.png'
import "./LoginPage.css";

function RegisterPage() {
  return (
    <div className="login-page">
      <div className="login-left">
        <img src={LoginImage} />
      </div>
      <div className="login-right">
        <div style={{textAlign: 'center'}}>
          <h1>Sign up for an account on PeerPrep!</h1> {/*todo*/}
        </div>
        <br/>
        <RegisterInput />
        <br />
        <br />
        <h4>Already have an account? Login here!</h4>
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
          <Link to='/login'>
            <Button variant="outlined">Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;